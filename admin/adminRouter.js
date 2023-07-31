import express from 'express'
const adminRouter = express.Router();


// const { authorize, verifyToken } = require("../middleware/authJWT");
// const Role = require("../middleware/role");
import {authenticate, register, updateEmail} from "./adminController.js"
// const {check,validationResult}=require('express-validator');
// const validationHandler=require('../middleware/validationHandler');


// router.post("/login",
//     check('username').exists().withMessage('There is no username given')
//         .isLength({ min: 1 }).withMessage('Username cannot be empty'),
//     check('password').exists().withMessage('There is no password given')
//         .isLength({ min: 1 }).withMessage('password cannot be empty'),
//     validationHandler(validationResult, 'Invalid Credentials')
//     , authController.authenticate); //login

adminRouter.post("/login",authenticate)
adminRouter.post("/register",register)
adminRouter.put("/email",updateEmail)



export default adminRouter ;