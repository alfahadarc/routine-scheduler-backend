import express from 'express'
import adminRouter from './admin/adminRouter.js';
import teacherRouter from './information/teacher/route.js'
import sectionRouter from './information/section/route.js';
import roomRouter from './information/room/route.js';

import {authorize} from './config/authorize.js'


const baseRouter = express.Router();

baseRouter.use("/admin", adminRouter)
baseRouter.use("/teacher",authorize(),teacherRouter)
baseRouter.use("/section",sectionRouter)
baseRouter.use("/room",roomRouter)





export default baseRouter;
