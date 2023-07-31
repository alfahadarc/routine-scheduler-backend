import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"

import { findAdminDB, registerAdminDB, updateEmailDB } from "./adminRepository.js"

const secret = process.env.SECRET;

var saltRounds = 10


export async function authenticate(req, res, next) {
    try {
        const admin = await findAdminDB(req.body.username);
        bcrypt.compare(req.body.password, admin.password, (err, result) => {
            if (result) {
                //token
                const token = jwt.sign(
                    {
                        username: admin.username,
                    },
                    secret,
                    { expiresIn: "2 days" }
                );

                admin.token = token;
                const { password, ...value } = admin;
                

                res.status(200).json({ message: "Logged IN!", value });
            } else {
                res.status(401).json({ error: "username or password is incorrect!" });
            }

        })

    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "username or password is incorrect" });
    }

}

export async function register(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        const rowsAffected = await registerAdminDB(username, hash, email);
        res.status(201).json({ message: "registration successfull!", username: admin.username, email: admin.email });
    } catch (error) {
        console.error()
        res.status(404).json({ error: error.message });
    }
}

export async function updateEmail(req, res, next) {

    var username = req.body.username
    var email = req.body.email
    try {
        const rowsAffected = await updateEmailDB(email, username)
        res.status(200).json({ message: "update successfull!", username: username });

    } catch (error) {
        console.error()
        res.status(404).json({ error: error.message });
    }
}
