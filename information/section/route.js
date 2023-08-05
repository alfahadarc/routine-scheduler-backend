import express from 'express'
const sectionRouter = express.Router();
import {getAllSection,addSection,editSection,deleteSection} from "./controller.js"
import validate from "../../config/validation.js";
import {body} from 'express-validator'


sectionRouter.get("/",getAllSection)


sectionRouter.post("/",validate([
    body('batch').isNumeric().notEmpty(),
    body('section').notEmpty(),
    body('type').isNumeric().notEmpty(),
    body('room').notEmpty(),
    body('session').notEmpty(),
]),addSection)
sectionRouter.put("/:batch/:section",validate([
    body('type').isNumeric().notEmpty(),
    body('room').notEmpty(),
    body('session').notEmpty(),
]),editSection)


sectionRouter.delete("/:batch/:section",deleteSection)


export default sectionRouter;