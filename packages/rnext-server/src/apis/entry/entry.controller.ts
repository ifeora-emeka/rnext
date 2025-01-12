import type { Request, Response, NextFunction } from 'express';
import { AppDataSource } from "../../data-source.ts";
import path from 'path'
import fs from 'fs'
import {formatEntityClassName} from "../../utils/formaters.ts";

export default class EntryController {
    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tableName = req.params.tableName?.trim();
            if (!tableName) {
                return res.status(400).json({ message: 'Table name is required' });
            }

            const { data } = req.body;
            if (!data || typeof data !== 'object') {
                return res.status(400).json({ message: 'Invalid data payload' });
            }

            // Dynamically import the entity
            const entityPath = path.resolve(__dirname, `../../../rnext/entities/${tableName}.ts`);
            console.log('\n\nEntity path:', entityPath);
            if (!fs.existsSync(entityPath)) {
                return res.status(400).json({ message: 'Entity not found for this table' });
            }

            const { [formatEntityClassName(tableName)]: Entity } = await import(entityPath);

            // Validate and save the data using TypeORM
            const repository = AppDataSource.getRepository(Entity);
            const entry = repository.create(data); // Validate and prepare the data
            const savedEntry = await repository.save(entry); // Save to the database

            return res.status(201).json({
                message: 'Entry created successfully',
                result: savedEntry,
            });
        } catch (error) {
            next(error);
        }
    };

    public findOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { entryID, tableName } = req.params;

            if (!tableName || !entryID) {
                return res.status(400).json({ message: "Table name and Entry ID are required" });
            }

            // Dynamically import the entity
            const entityPath = path.resolve(__dirname, `../../../rnext/entities/${tableName}.ts`);
            console.log('\n\nEntity path:', entityPath);
            if (!fs.existsSync(entityPath)) {
                return res.status(400).json({ message: 'Entity not found for this table' });
            }

            const { [formatEntityClassName(tableName)]: Entity } = await import(entityPath);

            // Use repository to find the entry
            const repository = AppDataSource.getRepository(Entity);
            const entry = await repository.findOne({ where: { id: entryID } });

            if (!entry) {
                return res.status(404).json({ message: `Entry with ID ${entryID} not found in table '${tableName}'` });
            }

            res.status(200).json(entry);
        } catch (error) {
            next(error);
        }
    };


    public updateOne = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (e) {
            next(e)
        }
    }

    public updateMany = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (e) {
            next(e)
        }
    }

    public deleteOne = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (e) {
            next(e)
        }
    }

    public deleteMany = async (req: Request, res: Response, next: NextFunction) => {
        try {

        } catch (e) {
            next(e)
        }
    }
}
