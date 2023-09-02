import express from 'express'
const teacherRouter = express.Router();
import { addTeacher, deleteTeacher, editTeacher, getAllTeacher, getTeacher } from './controller.js';
import validate from "../../config/validation.js";
import {body} from 'express-validator'

teacherRouter.get("/", getAllTeacher)
teacherRouter.get("/:initial", getTeacher)


teacherRouter.post("/", validate([
    body('email').isEmail().notEmpty(),
    body('seniority_rank').isNumeric().notEmpty(),
    body('theory_courses').isNumeric().notEmpty(),
    body('sessional_courses').isNumeric().notEmpty(),
    body('active').isIn(['0', '1']).notEmpty(),
    body('initial').notEmpty(),
    body('name').notEmpty(),
    body('surname').notEmpty()
]), addTeacher)
teacherRouter.put("/:initial",validate([
    body('email').isEmail().notEmpty(),
    body('seniority_rank').isNumeric().notEmpty(),
    body('theory_courses').isNumeric().notEmpty(),
    body('sessional_courses').isNumeric().notEmpty(),
    body('active').isIn(['0', '1']).notEmpty(),
    body('name').notEmpty(),
    body('surname').notEmpty()
]), editTeacher)
teacherRouter.delete("/:initial", deleteTeacher)

export default teacherRouter;