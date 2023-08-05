import express from 'express'
const teacherRouter = express.Router();
import { addTeacher, deleteTeacher, editTeacher, getAllTeacher,getTeacher } from './controller.js';


teacherRouter.get("/",getAllTeacher)
teacherRouter.get("/:initial",getTeacher)
teacherRouter.post("/",addTeacher)
teacherRouter.put("/:initial",editTeacher)
teacherRouter.delete("/:initial",deleteTeacher)

export default teacherRouter;