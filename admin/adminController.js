import bcrypt from 'bcryptjs'
import { findAdminDB, registerAdminDB , updateEmailDB} from "./adminRepository.js"

var saltRounds = 10


export async function authenticate(req, res, next) {
    try {
        const admin = await findAdminDB(req.body.username);
        bcrypt.compare(req.body.password, admin.password, (err, result)=>{
            if(result){
                res.status(200).json({ message: "User found!", username: admin.username, email:admin.email });
            }else{
                res.status(401).json({ error: "username or password is incorrect!" });
            }

        })
        
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "username or password is incorrect" });
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

export async function register(req, res, next) {
    var username = req.body.username
    var password = req.body.password
    var email = req.body.email

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        const rowsAffected = await registerAdminDB(username, hash, email);
        res.status(201).json({ message: "registration successfull!", username: admin.username, email:admin.email  });
    } catch (error) {
        console.error()
        res.status(404).json({ error: error.message });
    }
}

export async function updateEmail(req, res, next){
    
    var username = req.body.username
    var email = req.body.email
    try 
    {
        const rowsAffected = await updateEmailDB(email, username)
        res.status(200).json({ message: "update successfull!", username: username });

    }catch(error){
        console.error()
        res.status(404).json({ error: error.message });
    }
}
