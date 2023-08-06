import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { adminExistsEmail, findAdminDB as findAdminUsingUsername, registerAdminDB, updateEmailDB } from "./repository.js";

const secret = process.env.SECRET || "default-secret";
const saltRounds = 10;

export async function authenticate(req, res, next) {
  try {
    const admin = await findAdminUsingUsername(req.body.username);
    const result = await bcrypt.compare(req.body.password, admin.password);

    if (result) {
      const token = jwt.sign({ username: admin.username }, secret, {
        expiresIn: "2 days",
      });

      const { password, ...user } = admin;

      res.status(200).json({ message: "Logged in!", user, token });
    } else {
      res.status(401).json({ error: "username or password is incorrect!" });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "username or password is incorrect" });
  }
}

export async function forgetPassReq(req, res, next) {
  const email = req.body.email;
  if (await adminExistsEmail(email)) {
    // TODO: send email with reset link
    res.status(200).json({ message: "Check your email for the reset link!" });
  } else {
    res.status(404).json({ error: "Email not found!" });
  }
}

export async function register(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;

  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const rowsAffected = await registerAdminDB(username, hash, email);
    res.status(201).json({
      message: "registration successfull!",
      username: admin.username,
      email: admin.email,
    });
  } catch (error) {
    console.error();
    res.status(404).json({ error: error.message });
  }
}

export async function updateEmail(req, res, next) {
  var username = req.username;
  var email = req.body.email;
  try {
    const rowsAffected = await updateEmailDB(email, username);
    if (rowsAffected === 0) {
      res.status(404).json({ message: "username not found!" });
    } else {
      res
        .status(200)
        .json({ message: "update successfull!", username: username });
    }
  } catch (error) {
    console.error();
    res.status(404).json({ error: error.message });
  }
}
