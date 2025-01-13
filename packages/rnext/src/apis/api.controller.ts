import type {NextFunction, Response, Request} from "express";
import {SchemaService} from "./schemas/schema.service.ts";

export default class ApiController {
    private schemaService = new SchemaService();
    public getDependencies = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schemas = await this.schemaService.getAllSchemas();

            res.json({
                schemas
            })
        } catch (e) {
            next(e)
        }
    }

}