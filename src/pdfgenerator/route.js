import express from "express";
import { generatePDF, uploadPDF,teacherPDF} from "./controller.js";

const router = express.Router();

router.get("/generate/:lvlTerm", generatePDF);
router.get("/generateTeacher/:initial",teacherPDF)
router.get("/upload", uploadPDF);


export default router;