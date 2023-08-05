import express from 'express'
import adminRouter from './admin/adminRouter.js';
import teacherRouter from './information/teacher/route.js'
import sectionRouter from './information/section/route.js';
import roomRouter from './information/room/route.js';


const baseRouter = express.Router();

baseRouter.use("/admin", adminRouter)
baseRouter.use("/teacher",teacherRouter)
baseRouter.use("/section",sectionRouter)
baseRouter.use("/room",roomRouter)





export default baseRouter;
