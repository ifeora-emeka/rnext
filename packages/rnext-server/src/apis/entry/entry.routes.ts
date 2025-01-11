import express from 'express';
import EntryController from "./entry.controller.ts";

const entryRouter = express.Router();
const entryController = new EntryController();

entryRouter.post(
    '',
    entryController.create
)

export default entryRouter;

