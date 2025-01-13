import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const validateSchemaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const tableName = req.params.tableName?.trim();
    if (!tableName) {
        res.status(400).json({ message: 'Table name is required' });
        return;
    }

    const { payload } = req.body;
    if (!payload || typeof payload !== 'object') {
        res.status(400).json({ message: 'Invalid data payload' });
        return;
    }

    const schemaFilePath = path.join(__dirname, "../../../rnext/schemas", `${tableName}.json`);
    if (!fs.existsSync(schemaFilePath)) {
        res.status(404).json({ message: `Schema for table '${tableName}' not found` });
        return;
    }

    const schema = JSON.parse(fs.readFileSync(schemaFilePath, 'utf-8'));
    const errors: string[] = [];
    const prohibitedFields = ['id', 'created_at', 'updated_at'];

    prohibitedFields.forEach((field) => {
        if (field in payload) {
            errors.push(`${field} should not be included in the request body`);
        }
    });

    schema.fields.forEach((field: any) => {
        const { slug, type } = field.def;
        const isRequired = !field.column.nullable && !field.column.default && !prohibitedFields.includes(slug);

        if (isRequired && !(slug in payload)) {
            errors.push(`${slug} is required`);
        } else if (slug in payload) {
            const validType = validateType(payload[slug], type);
            if (!validType) {
                errors.push(`${slug} must be of type ${type}`);
            }
        }
    });

    if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
    }

    console.log('ENTRY VALIDATION PASSED');
    next();
};

const validateType = (value: any, type: string): boolean => {
    switch (type) {
        case 'number':
        case 'integer':
        case 'percentage':
        case 'currency':
            return typeof value === 'number';
        case 'text':
        case 'rich-text':
        case 'url':
        case 'email':
        case 'password':
        case 'slug':
        case 'uid':
            return typeof value === 'string';
        case 'boolean':
            return typeof value === 'boolean';
        case 'date':
        case 'timestamp':
            return !isNaN(Date.parse(value));
        case 'json':
            return typeof value === 'object';
        default:
            return false;
    }
};

export default validateSchemaMiddleware;
