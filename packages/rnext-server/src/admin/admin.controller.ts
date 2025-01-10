import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';

const ajv = new Ajv();

export default class AdminController {
    public createSchema = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { schemaName, schema } = req.body;

            if (!schemaName || !schema) {
                res.status(400).json({ error: 'schemaName and schema are required' });
            }

            // Validate the schema using ajv
            const isValidSchema = ajv.validateSchema(schema);
            if (!isValidSchema) {
                res.status(400).json({ error: 'Invalid JSON Schema', details: ajv.errors });
            }

            // Determine the schema directory path
            const rootDir = path.resolve(process.cwd(), 'rnext', 'schemas');

            // Create the directory if it doesn't exist
            if (!fs.existsSync(rootDir)) {
                fs.mkdirSync(rootDir, { recursive: true });
            }

            // Define the schema file path
            const schemaPath = path.join(rootDir, `${schemaName}.json`);

            // Write schema to file
            fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

            res.status(201).json({ message: 'Schema created successfully', path: schemaPath });
        } catch (e) {
            next(e);
        }
    };
}
