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

            const isValidSchema = ajv.validateSchema(schema);
            if (!isValidSchema) {
                res.status(400).json({ error: 'Invalid JSON Schema', details: ajv.errors });
            }

            const rootDir = path.resolve(process.cwd(), 'rnext', 'schemas');

            if (!fs.existsSync(rootDir)) {
                fs.mkdirSync(rootDir, { recursive: true });
            }

            const schemaPath = path.join(rootDir, `${schemaName}.json`);

            fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

            res.status(201).json({ message: 'Schema created successfully', path: schemaPath });
        } catch (e) {
            next(e);
        }
    };
}
