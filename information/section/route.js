import express from 'express'
const sectionRouter = express.Router();
import {getAllSection,addSection,editSection,deleteSection} from "./controller.js"

sectionRouter.get("/",getAllSection)
sectionRouter.post("/",addSection)
sectionRouter.put("/:batch/:section",editSection)
sectionRouter.delete("/:batch/:section",deleteSection)


export default sectionRouter;