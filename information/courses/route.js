
import express from 'express'

const router = express.Router();

import {  getAllCourse , addCourse , editCourse, deleteCourse } from './controller.js';
import validate from "../../config/validation.js";
import {body} from 'express-validator'

router.get("/", getAllCourse)
// router.get("/:initial", getCourse)

router.post("/",addCourse)
router.put("/:course_id",editCourse)
router.delete("/:course_id",deleteCourse)


export default router;