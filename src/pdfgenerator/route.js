import express from "express";
import { generatePDF, uploadPDF} from "./controller.js";

const router = express.Router();

router.get("/test", generatePDF);
router.get("/testupload", uploadPDF);


export default router;