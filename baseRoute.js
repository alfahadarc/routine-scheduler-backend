import express from 'express'
import adminRouter from './admin/adminRouter.js';
const baseRouter = express.Router();

baseRouter.use("/admin", adminRouter)





export default baseRouter;
