
import express from 'express'

const router = express.Router();

import { sendTheoryPrefMail,getCurrStatus } from './controller.js';

router.get("/theory/initiate",sendTheoryPrefMail)
router.get("/theory/status",getCurrStatus)




export default router;