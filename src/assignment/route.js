
import express from 'express.js'

const router = express.Router();

import { sendTheoryPrefMail } from './controller.js';

router.get("/theory/initiate",sendTheoryPrefMail)


export default router;