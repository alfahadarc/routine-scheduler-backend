
import express from 'express'
import {getForm,getAllForm,editForm} from "./controller.js"


const router = express.Router();



// theory/pref/{form_id} get

router.get("/",getAllForm)
router.get("/:uuid",getForm)
router.put("/:uuid",editForm)

// theory/pref/{form_id} postMessage
// theory/schedule/{form_id} get

// theory/schedule/{form_id} post
// sessional/pref/{form_id} get
// sessional/pref/{form_id} post


export default router;
