
import express from 'express'

const router = express.Router();



// theory/pref/{form_id} get

router.get("/",(req,res,next)=>{
    res.send("hello")
})

// theory/pref/{form_id} postMessage
// theory/schedule/{form_id} get

// theory/schedule/{form_id} post
// sessional/pref/{form_id} get
// sessional/pref/{form_id} post


export default router;
