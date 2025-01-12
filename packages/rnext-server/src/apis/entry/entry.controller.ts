import type {Request, Response, NextFunction} from 'express';
import {AppDataSource} from "../../data-source.ts";
import path from 'path'
import fs from 'fs'
import {formatEntityClassName} from "../../utils/formaters.ts";

export default class EntryController {
    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tableName = req.params.tableName?.trim();
            if (!tableName) {
                res.status(400).json({message: 'Table name is required'});
                return
            }

            const {payload} = req.body;
            if (!payload || typeof payload !== 'object') {
                res.status(400).json({message: 'Invalid data payload'});
                return
            }

            const entityPath = path.resolve(__dirname, `../../../rnext/entities/${tableName}.ts`);
            console.log('\n\nEntity path:', entityPath);
            if (!fs.existsSync(entityPath)) {
                res.status(400).json({message: 'Entity not found for this table'});
                return
            }

            const {[formatEntityClassName(tableName)]: Entity} = await import(entityPath);

            const repository = AppDataSource.getRepository(Entity);
            const entry = repository.create(payload);
            const savedEntry = await repository.save(entry);

            res.status(201).json({
                message: 'Entry created successfully',
                payload: savedEntry,
            });
        } catch (error) {
            next(error);
        }
    };

    public findOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {entryID, tableName} = req.params;

            if (!tableName || !entryID) {
                res.status(400).json({message: "Table name and Entry ID are required"});
                return
            }

            const entityPath = path.resolve(__dirname, `../../../rnext/entities/${tableName}.ts`);
            console.log('\n\nEntity path:', entityPath);
            if (!fs.existsSync(entityPath)) {
                res.status(400).json({message: 'Entity not found for this table'});
                return
            }

            const {[formatEntityClassName(tableName)]: Entity} = await import(entityPath);

            const repository = AppDataSource.getRepository(Entity);
            const entry = await repository.findOne({where: {id: entryID}});

            if (!entry) {
                res.status(404).json({message: `Entry with ID ${entryID} not found in table '${tableName}'`});
                return
            }

            res.status(200).json(entry);
        } catch (error) {
            next(error);
        }
    };

    public updateOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {tableName, entryID} = req.params;

            if (!tableName || !entryID) {
                res.status(400).json({message: "Table name and Entry ID are required"});
                return
            }
            const {payload} = req.body;
            if (!payload || typeof payload !== 'object') {
                res.status(400).json({message: "Invalid data payload"});
                return
            }

            const entityPath = path.resolve(__dirname, `../../../rnext/entities/${tableName}.ts`);
            if (!fs.existsSync(entityPath)) {
                res.status(400).json({message: "Entity not found for this table"});
                return
            }

            const {[formatEntityClassName(tableName)]: Entity} = await import(entityPath);

            const repository = AppDataSource.getRepository(Entity);

            const entry = await repository.findOne({where: {id: entryID}});
            if (!entry) {
                res.status(404).json({message: `Entry with ID ${entryID} not found in table '${tableName}'`});
                return
            }

            await repository.update({id: entryID}, payload);

            const updatedEntry = await repository.findOne({where: {id: entryID}});
            res.status(200).json({
                message: "Entry updated successfully",
                entry: updatedEntry,
            });
        } catch (error) {
            next(error);
        }
    };


    public updateMany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {tableName} = req.params;

            if (!tableName) {
                res.status(400).json({message: "Table name is required"});
                return
            }

            const {data, where} = req.body;
            if (!data || typeof data !== 'object') {
                res.status(400).json({message: "Invalid data payload"});
                return
            }

            if (!where || typeof where !== 'object') {
                res.status(400).json({message: "Invalid where condition"});
                return
            }

            const entityPath = path.resolve(__dirname, `../../../rnext/entities/${tableName}.ts`);
            if (!fs.existsSync(entityPath)) {
                res.status(400).json({message: "Entity not found for this table"});
                return
            }

            const {[formatEntityClassName(tableName)]: Entity} = await import(entityPath);

            const repository = AppDataSource.getRepository(Entity);

            const entries = await repository.find({where});
            if (!entries.length) {
                res.status(404).json({message: `No entries found in table '${tableName}' matching the condition`});
                return
            }

            await repository.update(where, data);

            const updatedEntries = await repository.find({where});
            res.status(200).json({
                message: "Entries updated successfully",
                entries: updatedEntries,
            });
        } catch (error) {
            next(error);
        }
    };


    public deleteOne = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {tableName, entryID} = req.params;

            if (!tableName || !entryID) {
                res.status(400).json({message: "Table name and Entry ID are required"});
                return
            }

            const entityPath = path.resolve(__dirname, `../../../rnext/entities/${tableName}.ts`);
            if (!fs.existsSync(entityPath)) {
                res.status(400).json({message: "Entity not found for this table"});
                return
            }

            const {[formatEntityClassName(tableName)]: Entity} = await import(entityPath);

            const repository = AppDataSource.getRepository(Entity);

            const entry = await repository.findOne({where: {id: entryID}});
            if (!entry) {
                res.status(404).json({message: `Entry with ID ${entryID} not found in table '${tableName}'`});
                return
            }

            await repository.delete({id: entryID});

            res.status(200).json({
                message: `Entry with ID ${entryID} successfully deleted from table '${tableName}'`,
            });
        } catch (error) {
            next(error);
        }
    };


    public deleteMany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {tableName} = req.params;

            if (!tableName) {
                res.status(400).json({message: "Table name is required"});
                return
            }

            const {where} = req.body;
            if (!where || typeof where !== 'object') {
                res.status(400).json({message: "Invalid where condition"});
                return
            }

            const entityPath = path.resolve(__dirname, `../../../rnext/entities/${tableName}.ts`);
            if (!fs.existsSync(entityPath)) {
                res.status(400).json({message: "Entity not found for this table"});
                return
            }

            const {[formatEntityClassName(tableName)]: Entity} = await import(entityPath);

            const repository = AppDataSource.getRepository(Entity);

            const entries = await repository.find({where});
            if (!entries.length) {
                res.status(404).json({message: `No entries found in table '${tableName}' matching the condition`});
                return
            }

            await repository.delete(where);

            res.status(200).json({
                message: `${entries.length} entries successfully deleted from table '${tableName}'`,
            });
        } catch (error) {
            next(error);
        }
    };

}
