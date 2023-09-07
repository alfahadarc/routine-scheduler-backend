import express from "express";
import {
    storeme,lab
} from "./controller.js";

const router = express.Router();



router.post("/fahad", storeme);
router.post("/lab", lab);

export default router;
