import express from 'express';
import SchemaController from "./schema.controller.ts";
import {validateRequest} from "../../middlewares/request.middleware.ts";
import {rNextSchemaValidation} from "./schema.dto.ts";

const schemaRouter = express.Router();
const schemaController = new SchemaController();

//@ts-ignore
schemaRouter.post('', validateRequest(rNextSchemaValidation, 'body'), schemaController.createSchema);
//@ts-ignore
schemaRouter.get('', schemaController.getAllSchemas);
//@ts-ignore
schemaRouter.put('', validateRequest(rNextSchemaValidation, 'body'), schemaController.updateSchema);


export default schemaRouter;