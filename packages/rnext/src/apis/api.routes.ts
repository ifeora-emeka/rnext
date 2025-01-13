import express from 'express';
import entryRouter from './entry/entry.routes.ts';
import schemaRouter from './schemas/schema.route.ts';
import ApiController from "./api.controller.ts";

const apiRoutes = express.Router();
const apiController = new ApiController();

apiRoutes.use('/entries', entryRouter);
apiRoutes.use('/schemas', schemaRouter);
apiRoutes.get('', apiController.getDependencies);

export default apiRoutes;