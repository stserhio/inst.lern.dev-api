const {v4: uuidv4} = require('uuid');
const bcrypt = require('bcryptjs')
const User = require("../models").User;
const Media = require("../models").Media;


exports.update = async (req, res) => {

    const {
        firstName,
        lastName,
        oldPassword,
        newPassword,
        phone,
        description,
        latitude,
        longitude,
        commercial,
    } = req.body

    const userUpdateData = {}
    if(firstName !== req.user.firstName){
        userUpdateData.firstName = firstName
    }

    if(lastName !== req.user.lastName){
        userUpdateData.lastName = lastName
    }

    await User.update(userUpdateData, {
        where: {
            id: req.user.id
        }
    });

    if(newPassword
        && newPassword.length > 0
        && oldPassword
        && oldPassword.length > 0) {

        const user = await User.findOne({where: {id: req.user.id}})
        if(user && (await bcrypt.compare(oldPassword, user.password))){
            const password = await bcrypt.hash(newPassword, 5)
            userUpdateData.password = password
        }
    }
    if(Object.keys(userUpdateData).length !== 0){
        await User.update(userUpdateData, {
            where: {
                id: req.user.id
            }
        })
        console.log(userUpdateData)
    }


    // const user = await
    //     console.log('------------------------')
    // console.log(req.body);
    // console.log('**********************')
    // console.log(req.user);
    // console.log('=========================')
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
    return res.status(200).json({"message": "update"});
};

exports.profileMe = async (req, res) => {

    console.log(req.body.user)
    const {id, firstName, lastName, email, avatar} = req.user
    return res.status(200).json({
        id,
        firstName,
        lastName,
        email,
        avatar,
    })

};

exports.profileUser = async (req, res) => {
    try {
        const {id, status} = req.body.user
        const user = User.findOne({where: {id: req.user.id}})

        if (!user || status == false) {
            return res.status(404).json({
                message: "Пользователя с таким id не найдено"
            })
        }

    } catch (err) {
        console.log(err)
        res.status(400).json({
            message: "Ошибка получения данных о профиле"
        })
    }
}

exports.avatar = async (req, res) => {

    if (!req.file) {
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
