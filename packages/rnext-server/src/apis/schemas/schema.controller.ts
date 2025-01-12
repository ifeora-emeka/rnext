import {AppDataSource} from "../../data-source.ts";
import type {Request, Response, NextFunction} from "express";
import fs from "fs";
import path from "path";
import {rNextDataType, type rNextSchemaDef} from "../../types/schema.types.ts";
import {convertSchemaToTypeORM} from "../../utils/converters.ts";
import type {QueryRunner} from "typeorm";
import {formatEntityClassName} from "../../utils/formaters.ts";



function mapTypeToTS(type: string): string {
    switch (type) {
        case "INTEGER":
            return "number";
        case "TEXT":
            return "string";
        case "TIMESTAMP":
            return "Date";
        case "BOOLEAN":
            return "boolean";
        default:
            return "any";
    }
}

export default class SchemaController {

    public createSchema = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tableName, fields, label }: rNextSchemaDef = req.body;

            if (!tableName || !fields || !Array.isArray(fields)) {
                return res.status(400).json({ error: "Table name and an array of fields are required" });
            }

            // Ensure 'id', 'created_at', and 'updated_at' are properly defined in schema
            fields.unshift(
                {
                    def: { label: "ID", slug: "id", type: rNextDataType.NUMBER },
                    column: {
                        name: "id",
                        type: "integer",
                        primary: true,
                        nullable: false,
                        unique: true,
                        autoincrement: true,
                    },
                },
                {
                    def: { label: "Created At", slug: "created_at", type: rNextDataType.TIMESTAMP },
                    column: {
                        name: "created_at",
                        type: "datetime",
                        nullable: false,
                        default: "CURRENT_TIMESTAMP",
                    },
                },
                {
                    def: { label: "Updated At", slug: "updated_at", type: rNextDataType.TIMESTAMP },
                    column: {
                        name: "updated_at",
                        type: "datetime",
                        nullable: false,
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP",
                    },
                }
            );

            // Convert the schema to TypeORM format
            const typeORMSchema = convertSchemaToTypeORM({ tableName, fields } as any);

            const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();

            // Create table query with correct field definitions
            const columnDefinitions = typeORMSchema.columns
                .map((col: any) => {
                    let definition = `${col.name} ${col.type}`;
                    if (col.primary) definition += " PRIMARY KEY";
                    if (col.autoincrement) definition += " AUTOINCREMENT";
                    if (!col.nullable) definition += " NOT NULL";
                    if (col.unique) definition += " UNIQUE";
                    if (col.default) definition += ` DEFAULT ${col.default}`;
                    if (col.onUpdate) definition += ` ON UPDATE ${col.onUpdate}`;
                    return definition;
                })
                .join(", ");


            const createTableQuery = `CREATE TABLE "${typeORMSchema.tableName}" (${columnDefinitions})`;

            // Run the query to create the table
            await queryRunner.query(createTableQuery);
            await queryRunner.release();

            // Save schema to JSON file
            const schemaFilePath = path.resolve("rnext", "schemas", `${tableName}.json`);
            if (!fs.existsSync(path.dirname(schemaFilePath))) {
                fs.mkdirSync(path.dirname(schemaFilePath), { recursive: true });
            }

            const schemaDefinition: Partial<rNextSchemaDef> = { label, tableName, fields };
            fs.writeFileSync(schemaFilePath, JSON.stringify(schemaDefinition, null, 2));

            // Generate the entity file for TypeORM
            const entityFilePath = path.resolve("rnext", "entities", `${tableName}.ts`);
            if (!fs.existsSync(path.dirname(entityFilePath))) {
                fs.mkdirSync(path.dirname(entityFilePath), { recursive: true });
            }

            const entityContent = `
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("${tableName}")
export class ${formatEntityClassName(tableName)} {
    @PrimaryGeneratedColumn()
    id: number;

    ${fields
                .filter((field) => !["id", "created_at", "updated_at"].includes(field.column.name))
                .map(
                    (field) => `
    @Column({ type: "${field.column.type}", ${field.column.nullable ? "nullable: true" : "nullable: false"} })
    ${field.column.name}: ${mapTypeToTS(field.column.type)};`
                )
                .join("\n")}

    @CreateDateColumn({ type: "datetime" })
    created_at: Date;

    @UpdateDateColumn({ type: "datetime" })
    updated_at: Date;
}


export const ${formatEntityClassName(tableName)}Metadata = {
    label: "${label}",
    slug: "${tableName}",
    description: "",
};
            `;

            fs.writeFileSync(entityFilePath, entityContent);

            res.status(201).json({
                message: `Schema '${tableName}' created successfully, entity file generated and saved`,
            });
        } catch (error) {
            next(error);
        }
    };

    public getAllSchemas = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schemasDirectory = path.resolve("./rnext/schemas");

            if (!fs.existsSync(schemasDirectory)) {
                return res.status(404).json({error: "Schemas directory not found"});
            }

            const schemaFiles = fs.readdirSync(schemasDirectory);

            const jsonSchemaFiles = schemaFiles.filter(file => file.endsWith(".json"));

            const schemas = jsonSchemaFiles.map(file => {
                const filePath = path.join(schemasDirectory, file);
                const fileContent = fs.readFileSync(filePath, "utf-8");
                return JSON.parse(fileContent);
            });

            res.status(200).json({schemas});
        } catch (error) {
            next(error);
        }
    };

    public updateSchema = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {tableName, fields}: rNextSchemaDef = req.body;

            if (!tableName || !fields || !Array.isArray(fields)) {
                return res.status(400).json({error: "Table name and an array of fields are required"});
            }

            const schemaFilePath = path.join(__dirname, "../../../rnext/schemas", `${tableName.trim()}.json`);
            console.log("Schema file path:", schemaFilePath);

            if (!fs.existsSync(schemaFilePath)) {
                return res.status(404).json({error: `Schema file: '${tableName}' not found`});
            }

            const updatedSchema = {tableName, fields};
            const typeORMSchema = convertSchemaToTypeORM(updatedSchema as any);

            const queryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();

            for (const column of typeORMSchema.columns) {
                const columnExists = await queryRunner.query(`PRAGMA table_info(${typeORMSchema.tableName})`);
                const columnFound = columnExists.some((col: any) => col.name === column.name);

                if (!columnFound) {
                    const columnDefinition = `${column.name} ${column.type}`;
                    const alterColumnQuery = `ALTER TABLE ${typeORMSchema.tableName}
                        ADD COLUMN ${columnDefinition}`;
                    await queryRunner.query(alterColumnQuery);
                } else {
                    console.log(`Column '${column.name}' already exists. Skipping addition.`);
                }
            }

            await queryRunner.release();

            fs.writeFileSync(schemaFilePath, JSON.stringify(updatedSchema, null, 2));

            res.status(200).json({message: `Schema '${tableName}' updated successfully`});
        } catch (error) {
            next(error);
        }
    };

    public _syncSchema = async () => {
        try {
            console.log(`\n=================================`)
            console.log(`Syncing schemas...`)
            console.log(`\n=================================\n`)
            const schemasDirectory = path.join(__dirname, '../../../rnext/schemas');
            const schemaFiles = fs.readdirSync(schemasDirectory);
            const queryRunner = AppDataSource.createQueryRunner();

            await queryRunner.connect();

            for (const schemaFile of schemaFiles) {
                const schemaFilePath = path.join(schemasDirectory, schemaFile);
                const schemaContent = fs.readFileSync(schemaFilePath, 'utf-8');
                const {tableName, fields}: {
                    tableName: string,
                    fields: any[]
                } = JSON.parse(schemaContent);

                if (!tableName || !fields || !Array.isArray(fields)) {
                    continue;
                }

                const typeORMSchema = convertSchemaToTypeORM({tableName, fields} as any);

                const tableExists = await this.checkIfTableExists(typeORMSchema.tableName, queryRunner);

                if (tableExists) {
                    const dbColumns = await this.getDatabaseColumns(typeORMSchema.tableName, queryRunner);

                    // Check for missing/extra columns
                    for (const column of typeORMSchema.columns) {
                        const columnExists = dbColumns.some((dbColumn: any) => dbColumn.name === column.name);

                        if (!columnExists) {
                            // Add missing column
                            const columnDefinition = `${column.name} ${column.type}`;
                            await queryRunner.query(`ALTER TABLE ${typeORMSchema.tableName}
                                ADD COLUMN ${columnDefinition}`);
                        }
                    }

                    for (const dbColumn of dbColumns) {
                        const columnExistsInSchema = typeORMSchema.columns.some((col: any) => col.name === dbColumn.name);
                        if (!columnExistsInSchema) {
                            // Drop extra column
                            await this.dropColumn(typeORMSchema.tableName, dbColumn.name, queryRunner);
                        }
                    }

                    for (const dbColumn of dbColumns) {
                        const columnInSchema = typeORMSchema.columns.find((col: any) => col.name === dbColumn.name);
                        if (columnInSchema && columnInSchema.type !== dbColumn.type) {
                            // Alter column type if necessary
                            const alterColumnQuery = `ALTER TABLE ${typeORMSchema.tableName}
                                ALTER COLUMN ${dbColumn.name} SET DATA TYPE ${columnInSchema.type}`;
                            await queryRunner.query(alterColumnQuery);
                        }
                    }
                } else {
                    const createTableQuery = `
                        CREATE TABLE ${typeORMSchema.tableName}
                        (
                            ${typeORMSchema.columns.map(col => `${col.name} ${col.type}`).join(', ')}
                        )`;
                    await queryRunner.query(createTableQuery);
                }

                fs.writeFileSync(schemaFilePath, JSON.stringify({
                    tableName,
                    fields
                }, null, 2));
            }

            await queryRunner.release();

            return {message: 'Schema sync completed successfully'};
        } catch (error) {
            return error
        }
    };

    public syncSchema = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this._syncSchema()
            res.json({message: "sync completed"})
        } catch (e) {
            console.log('SCHEMA SYNC ERROR:::', e)
            next(e)
        }
    }


    private checkIfTableExists = async (tableName: string, queryRunner: any) => {
        const result = await queryRunner.query(`
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
              AND name = '${tableName}'
        `);
        return result.length > 0;
    }

    private getDatabaseColumns = async (tableName: string, queryRunner: any) => {
        const columns = await queryRunner.query(`PRAGMA table_info(${tableName})`);
        return columns.map((col: any) => ({name: col.name, type: col.type}));
    }

    private dropColumn = async (tableName: string, columnName: string, queryRunner: any) => {
        const columns = await this.getDatabaseColumns(tableName, queryRunner);
        const columnsToKeep = columns.filter((col: any) => col.name !== columnName);
        const columnDefinitions = columnsToKeep.map((col: any) => `${col.name} ${col.type}`).join(', ');

        const tempTableName = `${tableName}_temp`;

        // Create a new temporary table with the correct columns
        await queryRunner.query(`
            CREATE TABLE ${tempTableName}
            (
                ${columnDefinitions}
            )`
        );

        await queryRunner.query(`
            INSERT INTO ${tempTableName}
            SELECT ${columnsToKeep.map((col: any) => col.name).join(', ')}
            FROM ${tableName}`
        );

        await queryRunner.query(`DROP TABLE ${tableName}`);

        await queryRunner.query(`ALTER TABLE ${tempTableName} RENAME TO ${tableName}`);
    }


}
