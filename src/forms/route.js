
import express from 'express.js'

const router = express.Router();

// form - > key[teacher_initial_preferences/schedule], type[theory/sessional], response

// theory/pref/{form_id} get

import { sendTheoryMail } from './controller.js';

formRouter.get("/theory/pref",sendTheoryMail)

// theory/pref/{form_id} postMessage
// theory/schedule/{form_id} get

// theory/schedule/{form_id} post
// sessional/pref/{form_id} get
// sessional/pref/{form_id} post


export default router;
