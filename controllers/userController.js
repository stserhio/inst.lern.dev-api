
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const mailConfirmTemplate = require("../templates/mailConfirmTemplate");
const sendMail = require("../services/mailer");
const User = require("../models").User;
const BlackList = require("../models").BlackList;


exports.update = async (req, res) => {
    console.log(req.body);
    // const { email, password } = req.body;

    // const user = await User.findOne({ where: { email } });

    // if (user && (await bcrypt.compare(password, user.password))) {

    //     const tokenId = uuidv4();

    //     const token = jwt.sign(
    //         {
    //             id: user.id,
    //             firstName: user.firstName,
    //             lastName: user.lastName,
    //             email: user.email,
    //             avatar: user.avatar,
    //             tokenId
    //         },
    //         process.env.TOKEN_KEY,
    //         {
    //             expiresIn: "60d",
    //         }
    //     );
    //     user.token = token;

    //     return res.status(200).json(user);
    // }

    return res.status(401).json({"message":"Логин или пароль указан не верно"});
};

