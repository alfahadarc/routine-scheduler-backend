import { findAdmin } from "./adminRepository.js"


export async function authenticate(req, res, next) {
    try {
        const admin = await findAdmin(req.body.username);
        res.status(200).json({ message: "User found!", admin });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "User not found!" });
    }


    // if (rows.length > 0) {
    //     bcrypt.compare(req.body.password, rows[0].PASSWORD, (err, result) => {
    //         if (result) {
    //             //token
    //             const user = rows[0];
    //             const token = jwt.sign(
    //                 {
    //                     username: user.USER_NAME,
    //                     role: user.USER_ROLE,
    //                 },
    //                 secret,
    //                 { expiresIn: "2 days" }
    //             );

    //             user.token = token;
    //             const { PASSWORD, ...value } = user;
    //             res.json(value);
    //         } else {
    //             res
    //                 .status(400)
    //                 .json(message.error("Username or Password is Incorrect"));
    //         }
    //     });
    // } else {
    //     res.status(400).json(message.error("Username or Password is Incorrect"));
    // }
}
