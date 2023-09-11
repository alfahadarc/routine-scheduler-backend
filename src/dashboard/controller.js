import { sendTheorySchedNextMail } from "../schedule/controller.js";
import {
    getTheoryEmail,
    getScheduleEmail,
    getSessionalEmail,
    updateTheoryEmail,
    updateScheduleEmail,
    updateSessionalEmail
} from "./repository.js";

export async function getEmailForTheory(req, res, next) {


    try {
        const email = await getTheoryEmail();

        res.status(200).json({ email: email });
    } catch (err) {
        next(err);
    }
}

export async function getEmailForSchedule(req, res, next) {
    try {
        const email = await getScheduleEmail();

        res.status(200).json({ email: email });
    } catch (err) {
        next(err);
    }
}

export async function getEmailForSessional(req, res, next) {
    try {
        const email = await getSessionalEmail();

        res.status(200).json({ email: email });
    } catch (err) {
        next(err);
    }
}

export async function saveEmailForTheory(req, res, next) {
    try {
        const email = req.body.email;
        const results = await updateTheoryEmail(email);
        if (results > 0) {
            res.status(200).json({ message: "Email saved" });
        } else {
            res.status(500).json({ message: "Email not updated" });
        }
    } catch (err) {
        next(err);
    }
}

export async function saveEmailForSchedule(req, res, next) {
    try {
        const email = req.body.email;
        const results = await updateScheduleEmail(email);
        if (results > 0) {
            res.status(200).json({ message: "Email saved" });
        } else {
            res.status(500).json({ message: "Email not updated" });
        }
    } catch (err) {
        next(err);
    }
}

export async function saveEmailForSessional(req, res, next) {
    try {
        const email = req.body.email;
        const results = await updateSessionalEmail(email);
        if (results > 0) {
            res.status(200).json({ message: "Email saved" });
        } else {
            res.status(500).json({ message: "Email not updated" });
        }
    } catch (err) {
        next(err);
    }
}

