import express from 'express'
const roomRouter = express.Router();

import {getAllRoom,addRoom,editRoom,deleteRoom} from "./controller.js"


roomRouter.get("/",getAllRoom)
roomRouter.post("/",addRoom)
roomRouter.put("/:room",editRoom)
roomRouter.delete("/:room",deleteRoom)


export default roomRouter;