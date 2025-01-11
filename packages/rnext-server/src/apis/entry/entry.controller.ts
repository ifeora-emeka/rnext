import type { Request, Response, NextFunction } from 'express';
import type { QueryRunner } from 'typeorm';
import { AppDataSource } from "../../data-source.ts";

export default class EntryController {
    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tableName = req.params.tableName?.trim();
            if (!tableName) {
                res.status(400).json({ message: 'Table name is required' });
                return;
            }

            const { data } = req.body;
            if (!data || typeof data !== 'object') {
                res.status(400).json({ message: 'Invalid data payload' });
                return;
            }

            const queryRunner: QueryRunner = AppDataSource.createQueryRunner();
            await queryRunner.connect();

            const columns = Object.keys(data).map((key) => `"${key}"`).join(', ');
            const values = Object.values(data)
                .map((value) => (typeof value === 'string' ? `'${value}'` : value))
                .join(', ');

            const query = `INSERT INTO "${tableName}" (${columns}) VALUES (${values}) RETURNING *;`;

            const result = await queryRunner.query(query);

            await queryRunner.release();

            res.status(201).json({
                message: 'Entry created successfully',
                result,
            });
        } catch (e) {
            next(e);
        }
    };
}
