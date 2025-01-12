import fs from "fs";
import path from "path";
import { formatEntityClassName } from "../../utils/formaters.ts";
import type { rNextSchemaDef } from "../../types/schema.types.ts";
import {formatDefaultValue, mapTypeToTS} from "./schema.utils.ts";

export class SchemaService {

    public generateEntityContent(tableName: string, label: string, fields: any[]): string {
        return `
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("${tableName}")
export class ${formatEntityClassName(tableName)} {
    @PrimaryGeneratedColumn()
    id: number;

    ${fields
            .filter((field) => !["id", "created_at", "updated_at"].includes(field.column.name))
            .map((field) => {
                console.log('THE DEFAULT VALUE IS: ', field.column.default);
                const defaultValue = field.column.default !== undefined
                    ? formatDefaultValue(field.column.default, field.column.type)
                    : "";

                return `
    @Column({
        type: "${field.column.type}",
        ${field.column.nullable ? "nullable: true" : "nullable: false"},
        ${defaultValue ? `default: ${defaultValue}` : ""}
    })
    ${field.column.name}: ${mapTypeToTS(field.column.type)};
`;
            })
            .join("")}

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
    }

    public createSchemaFile(schemaFilePath: string, schemaDefinition: object): void {
        if (!fs.existsSync(path.dirname(schemaFilePath))) {
            fs.mkdirSync(path.dirname(schemaFilePath), { recursive: true });
        }
        fs.writeFileSync(schemaFilePath, JSON.stringify(schemaDefinition, null, 2));
    }

    public createEntityFile(entityFilePath: string, entityContent: string): void {
        if (!fs.existsSync(path.dirname(entityFilePath))) {
            fs.mkdirSync(path.dirname(entityFilePath), { recursive: true });
        }
        fs.writeFileSync(entityFilePath, entityContent);
    }

    public async createSchema(schemaDef: rNextSchemaDef): Promise<void> {
        const { tableName, fields, label } = schemaDef;
        const schemaFilePath = path.resolve("rnext", "schemas", `${tableName}.json`);
        const schemaDefinition: Partial<rNextSchemaDef> = { label, tableName, fields };
        this.createSchemaFile(schemaFilePath, schemaDefinition);

        const entityFilePath = path.resolve("rnext", "entities", `${tableName}.ts`);
        const entityContent = this.generateEntityContent(tableName, label, fields);
        this.createEntityFile(entityFilePath, entityContent);
    }

    public async updateSchema(schemaDef: rNextSchemaDef): Promise<void> {
        const { tableName, fields, label } = schemaDef;
        const schemaFilePath = path.resolve("rnext", "schemas", `${tableName}.json`);
        const entityFilePath = path.resolve("rnext", "entities", `${tableName}.ts`);

        if (!fs.existsSync(schemaFilePath)) {
            throw new Error(`Schema file '${tableName}' not found`);
        }

        if (!fs.existsSync(entityFilePath)) {
            throw new Error(`Entity file for '${tableName}' not found`);
        }

        const updatedSchema = { tableName, label, fields };
        this.createSchemaFile(schemaFilePath, updatedSchema);

        const entityContent = this.generateEntityContent(tableName, label, fields);
        this.createEntityFile(entityFilePath, entityContent);
    }

    public async deleteSchema(tableName: string): Promise<void> {
        const schemaFilePath = path.resolve("rnext", "schemas", `${tableName}.json`);
        const entityFilePath = path.resolve("rnext", "entities", `${tableName}.ts`);

        if (fs.existsSync(schemaFilePath)) {
            fs.unlinkSync(schemaFilePath);
        }

        if (fs.existsSync(entityFilePath)) {
            fs.unlinkSync(entityFilePath);
        }
    }

    public async getAllSchemas(): Promise<any[]> {
        const schemasDirectory = path.resolve("./rnext/schemas");

        if (!fs.existsSync(schemasDirectory)) {
            throw new Error("Schemas directory not found");
        }

        const schemaFiles = fs.readdirSync(schemasDirectory);
        const jsonSchemaFiles = schemaFiles.filter(file => file.endsWith(".json"));

        return jsonSchemaFiles.map(file => {
            const filePath = path.join(schemasDirectory, file);
            const fileContent = fs.readFileSync(filePath, "utf-8");
            return JSON.parse(fileContent);
        });
    }
}