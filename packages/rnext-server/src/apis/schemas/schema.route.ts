import express from 'express';
import SchemaController from "./schema.controller.ts";

const schemaRouter = express.Router();
const schemaController = new SchemaController();

//@ts-ignore
schemaRouter.post('/schemas', schemaController.createSchema);
//@ts-ignore
schemaRouter.get('/schemas', schemaController.getAllSchemas);
//@ts-ignore
schemaRouter.put('/schemas', schemaController.updateSchema);
//@ts-ignore
schemaRouter.put('/schemas/sync', schemaController.syncSchema);


export default schemaRouter;