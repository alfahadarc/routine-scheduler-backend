import express from 'express'
const formRouter = express.Router();

// import validate from "../../config/validation.js";
// import {body} from 'express-validator'
import { sendTheoryMail } from './controller.js';

formRouter.get("/theory/pref",sendTheoryMail)

export default formRouter;