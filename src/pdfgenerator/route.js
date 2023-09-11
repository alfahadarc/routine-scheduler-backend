import express from "express";
import { generatePDF, uploadPDF,teacherPDF,roomPDF,serveLvlTermPDF,getAllInitial,serveTeacherPDF,serveRoomPDF,getAllIRooms, getAllLevelTerm, sendMailToTeacher} from "./controller.js";

const router = express.Router();

router.get("/generate/:lvlTerm", generatePDF);
router.get("/generateTeacher/:initial",teacherPDF);
router.get("/generateRoom/:room", roomPDF)
router.get("/upload", uploadPDF);


router.get("/showTerm/:lvlTerm/:section",serveLvlTermPDF);
router.get("/showTeacher/:initial",serveTeacherPDF);
router.get("/showRoom/:room",serveRoomPDF);


router.get("/sendMail/:initial", sendMailToTeacher)


router.get("/allInitial", getAllInitial);
router.get("/allRooms", getAllIRooms);
router.get("/allLevelTerm", getAllLevelTerm)


export default router;