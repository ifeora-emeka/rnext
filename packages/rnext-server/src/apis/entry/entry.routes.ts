import express from 'express';
import EntryController from "./entry.controller.ts";

const entryRouter = express.Router();
const entryController = new EntryController();

entryRouter.post(
    '/:tableName',
    entryController.create
);
entryRouter.get(
    '/:tableName/:entryID',
    entryController.findOne
);

export default entryRouter;

