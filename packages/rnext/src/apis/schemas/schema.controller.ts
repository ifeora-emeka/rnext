import type { Request, Response, NextFunction } from "express";
import { SchemaService } from "./schema.service.ts";
import type {rNextSchemaDef} from "../../types/schema.types.ts";

export default class SchemaController {
    private schemaService = new SchemaService();

    public createSchema = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schemaDef: rNextSchemaDef = req.body;
            await this.schemaService.createSchema(schemaDef);
            res.status(201).json({ message: `Schema '${schemaDef.tableName}' created successfully, entity file generated and saved` });
        } catch (error) {
            next(error);
        }
    };

    public getAllSchemas = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schemas = await this.schemaService.getAllSchemas();
            res.status(200).json({ schemas });
        } catch (error) {
            next(error);
        }
    };

    public updateSchema = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schemaDef: rNextSchemaDef = req.body;
            await this.schemaService.updateSchema(schemaDef);
            res.status(200).json({ message: `Schema and entity files for '${schemaDef.tableName}' updated successfully` });
        } catch (error) {
            next(error);
        }
    };

    public deleteSchema = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { tableName } = req.params;
            await this.schemaService.deleteSchema(tableName);
            res.status(200).json({ message: `Schema and entity files for '${tableName}' deleted successfully` });
        } catch (error) {
            next(error);
        }
    };
}