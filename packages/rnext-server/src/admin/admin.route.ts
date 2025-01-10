import express from 'express';
import AdminController from "./admin.controller.ts";

const adminRouter = express.Router();
const adminController = new AdminController();

adminRouter.post('/schema', adminController.createSchema);


export default adminRouter;