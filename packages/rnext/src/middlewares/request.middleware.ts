import type { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema, property: 'body' | 'query' | 'params') => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req[property]);
            next();
        } catch (error) {
            //@ts-ignore
            return res.status(400).json({ error: error?.errors });
        }
    };
};