import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  adminExistsEmail,
  findAdminDB as findAdminUsingUsername,
  registerAdminDB,
  updateEmailDB,
} from "./repository.js";
import { HttpError } from "../config/error-handle.js";

const secret = process.env.SECRET || "default-secret";
const saltRounds = 10;

export async function authenticate(req, res, next) {
  try {
    const admin = await findAdminUsingUsername(req.body.username);
    console.log(admin);
    const result = await bcrypt.compare(req.body.password, admin.password);

    if (result) {
      const token = jwt.sign({ username: admin.username }, secret, {
        expiresIn: "2 days",
      });

      const { password, ...user } = admin;

      res.status(200).json({ message: "Logged in!", user, token });
    } else {
      throw new HttpError(401, "username or password is incorrect!");
    }
  } catch (error) {
    next(error);
  }
}

export async function forgetPassReq(req, res, next) {
  const email = req.body.email;
  if (await adminExistsEmail(email)) {
    // TODO: send email with reset link
    res.status(200).json({ message: "Check your email for the reset link!" });
  } else {
    throw new HttpError(404, "Email not found!");
  }
}

export async function register(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    await registerAdminDB(username, hash, email);
    res.status(201).json({
      message: "registration successfull!",
      username: admin.username,
      email: admin.email,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateEmail(req, res, next) {
  var username = req.username;
  var email = req.body.email;
  try {
    await updateEmailDB(email, username);
    res
      .status(200)
      .json({ message: "update successfull!", username: username });
  } catch (error) {
    next(error);
  }
}
