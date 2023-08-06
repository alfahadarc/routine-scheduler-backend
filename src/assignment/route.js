
import express from 'express'

const router = express.Router();

import { sendTheoryPrefMail,getCurrStatus,finalizeTheoryPreference } from './controller.js';

router.get("/theory/initiate",sendTheoryPrefMail)
router.get("/theory/status",getCurrStatus)
router.get("/theory/finalize",finalizeTheoryPreference)




export default router;