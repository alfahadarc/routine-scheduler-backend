import express from "express";
const labRoomAssignRouter = express.Router();

import {getAllLabRoom,getAllLabCourse,assignLabRooms} from "./controller.js"

labRoomAssignRouter.get("/room",getAllLabRoom)
labRoomAssignRouter.get("/course",getAllLabCourse)
labRoomAssignRouter.put("/assign",assignLabRooms)

export default labRoomAssignRouter;