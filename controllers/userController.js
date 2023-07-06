const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require('uuid');

const mailConfirmTemplate = require("../templates/mailConfirmTemplate");
const sendMail = require("../services/mailer");
const User = require("../models").User;
const BlackList = require("../models").BlackList;
const Media = require("../models").Media;


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

    return res.status(401).json({"message": "Логин или пароль указан не верно"});
};

exports.profileMe = async (req, res) => {
    try {

        console.log(req.body.user)
        const {id, firstName, lastName, email, avatar} = req.body.user
        return res.status(200).json({
            id,
            firstName,
            lastName,
            email,
            avatar,
        })

    } catch (err) {
        console.log(err)
        res.status(401).json({
            message: "Ошибка получения данных о профиле"
        })
    }

};

exports.profileUser = async(req, res) =>{
    try{
        const {id, status} = req.body.user
        const user = User.findOne({where: {id: req.user.id}})

        if(!user || status == false){
            return res.status(404).json({
                message: "Пользователя с таким id не найдено"
            })
        }

    }catch (err) {
        console.log(err)
        res.status(400).json({
            message: "Ошибка получения данных о профиле"
        })
    }
}

exports.avatar = async (req, res) => {

    if(!req.file){
        return res.json({
            message: "Выберите файлы"
        })
    }

    const media = await Media.create({
        'model': 'User',
        'modelId': req.user.id,
        'type': req.file.mimetype,
        'size': req.file.size,
        'fieldname': req.file.fieldname,
        'path': req.file.key

    })

    return res.status(200).json({
        message: "Файл сохранен"
    })
}
