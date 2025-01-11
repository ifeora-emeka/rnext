import express from 'express';
import entryRouter from './entry/entry.routes.ts';
import schemaRouter from './schemas/schema.route.ts';

const apiRoutes = express.Router();

apiRoutes.use('/entries', entryRouter);
apiRoutes.use('/schemas', schemaRouter);

export default apiRoutes;