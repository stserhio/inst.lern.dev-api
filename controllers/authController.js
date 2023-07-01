const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

const mailConfirmTemplate = require("../templates/mailConfirmTemplate");
const sendMail = require("../services/mailer");
const mailForgotTemplate = require("../templates/mailForgotTemplate");
const User = require("../models").User;
const BlackList = require("../models").BlackList;

// Получение данных для регистрации, отправка письма для подтверждения
exports.register = async (req, res) => {

    let { firstName, lastName, email, password } = req.body;

    password = await bcrypt.hash(password, 5);

    // Время жизни токена 10 мин, только для проверки письма
    const token = jwt.sign(
        { firstName, lastName, email, password },
        process.env.TOKEN_KEY,
        {
            expiresIn: "600s",
        }
    );

    const data = {
        userName: firstName + ' ' + lastName,
        token: token
    };

    const options = {
        from: `TESTING <${process.env.MAIL}>`,
        to: email,
        subject: "Регистрация аккаунта в приложении Instagram",
        text: `Скопируйте адрес, вставьте в адресную строку вашего браузера и нажмите ввод - https://instagram.lern.dev/api/v1/confirm?tkey=${token}`,
        html: mailConfirmTemplate(data),
    };

    try {
        const resultSentMail = await sendMail(options);
    } catch (err) {
        return res.status(418).json({ "message": "Ошибка отправки письма" });
    }

    return res.status(200).json({ "message": "Письмо отправлено" });
};

// Регистрация пользователя после подтверждения из письма
exports.confirm = async (req, res) => {

    const { firstName, lastName, email, password } = req.body;

    const user = await User.create({
        firstName,
        lastName,
        email,
        password
    });

    const tokenId = uuidv4();

    const token = jwt.sign(
        {
            id: user.id,
            firstName,
            lastName,
            email,
            avatar: user.avatar,
            tokenId
        },
        process.env.TOKEN_KEY,
        {
            expiresIn: "60d",
        }
    );

    user.token = token;

    return res.status(201).json(user);
};

// Вход в систему
exports.login = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {

        const tokenId = uuidv4();

        const token = jwt.sign(
            {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar,
                tokenId
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "60d",
            }
        );
        user.token = token;

        return res.status(200).json(user);
    }

    return res.status(401).json({ "message": "Логин или пароль указан не верно" });
};

// Выход из системы
exports.logout = async (req, res) => {

    const { id, tokenId, exp } = req.body.user;

    const ban = await BlackList.create({
        id: tokenId,
        userId: id,
        timeLive: exp
    });

    return res.status(200).json({ "message": "Выполнено успешно" });
};

// Отправка письма для восстановления пароля
exports.forgot = async (req, res) => {

    const { email } = req.body;

    const user = await User.findOne({
        where: { email },
        attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'status']
    });

    if (!user) return res.status(401).json({ "message": "Пользователь с таким почтовым адресом не найден" });

    const tokenId = uuidv4();

    // Время жизни токена 10 мин, только для проверки письма
    const token = jwt.sign(
        {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatar: user.avatar,
            tokenId
        },
        process.env.TOKEN_KEY,
        {
            expiresIn: "600s",
        }
    );

    const data = {
        userName: user.firstName + ' ' + user.lastName,
        token: token
    };

    const options = {
        from: `TESTING <${process.env.MAIL}>`,
        to: email,
        subject: "Восстановление пароля в приложении Instagram",
        text: `Скопируйте адрес, вставьте в адресную строку вашего браузера и нажмите ввод - https://instagram.lern.dev/api/v1/changepassword?tkey=${data.token}`,
        html: mailForgotTemplate(data),
    };

    try {
        const resultSentMail = await sendMail(options);
    } catch (err) {
        return res.status(418).json({ "message": "Ошибка отправки письма" });
    }

    return res.status(200).json({ "message": "Письмо отправлено" });
};

// Запись в базу нового пароля
exports.changepassword = async (req, res) => {

    let { password } = req.body;

    const { id, tokenId, exp } = req.body.user;

    const ban = await BlackList.create({
        id: tokenId,
        userId: id,
        timeLive: exp
    });

    password = await bcrypt.hash(password, 5);

    await User.update({ password }, { where: { id } });

    return res.status(201).json({ "message": "Пароль изменён" });
};