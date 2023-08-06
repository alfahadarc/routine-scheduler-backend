import express from "express";
const router = express.Router();

import { authenticate, register, updateEmail } from "./controller.js";

router.post("/login", authenticate);
router.post("/forget-pass-req", authenticate);
router.post("/forget-pass", authenticate);
router.put("/update-email", updateEmail);

router.post("/register", register);

export default router;
