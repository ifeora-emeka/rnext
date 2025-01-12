import express from 'express';
import EntryController from "./entry.controller.ts";
import validateSchemaMiddleware from "./entity.middleware.ts";

const entryRouter = express.Router();
const entryController = new EntryController();

entryRouter.post(
    '/:tableName',
    validateSchemaMiddleware,
    entryController.create
);
entryRouter.get(
    '/:tableName/:entryID',
    entryController.findOne
);
entryRouter.put(
    '/:tableName/:entryID',
    validateSchemaMiddleware,
    entryController.updateOne
);
entryRouter.put(
    '/:tableName',
    validateSchemaMiddleware,
    entryController.updateMany
);
entryRouter.delete(
    '/:tableName/:entryID',
    validateSchemaMiddleware,
    entryController.deleteOne
);
entryRouter.delete(
    '/:tableName',
    validateSchemaMiddleware,
    entryController.deleteMany
);

export default entryRouter;

