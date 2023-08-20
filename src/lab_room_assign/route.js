import express from "express";
const labRoomAssignRouter = express.Router();

import {getAllLabRoom,getAllLabCourse} from "./controller.js"

labRoomAssignRouter.get("/room",getAllLabRoom)
labRoomAssignRouter.get("/course",getAllLabCourse)

export default labRoomAssignRouter;