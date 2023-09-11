import express from "express";
import {
    getEmailForTheory,
    getEmailForSchedule,
    getEmailForSessional,
    saveEmailForTheory,
    saveEmailForSchedule,
    saveEmailForSessional

} from "./controller.js";
import { body } from 'express-validator'
import validate from "../config/validation.js";

const router = express.Router();

// theory/pref/{form_id} get


router.get("/email/theory", getEmailForTheory);
router.get("/email/schedule", getEmailForSchedule);
router.get("/email/sessional", getEmailForSessional);

router.put("/email/theory", validate([
    body('email').notEmpty()
]), saveEmailForTheory);
router.put("/email/schedule", validate([
    body('email').notEmpty()
]), saveEmailForSchedule);
router.put("/email/sessional", validate([
    body('email').notEmpty()
]), saveEmailForSessional);



export default router;
