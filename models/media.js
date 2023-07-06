'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    //
    // /**
    //  * @swagger
    //  * components:
    //  *   schemas:
    //  *     mediaModel:
    //  *       type: object
    //  *       properties:
    //  *         id:
    //  *           type: integer
    //  *           description: id медиа файла в таблице
    //  *         ext:
    //  *           type: string
    //  *           description: ex. jpg, png, gif
    //  *         size:
    //  *           type: integer
    //  *           description: size of media
    //  *
    //  *
    //  */
    //
    class Media extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Media.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        model: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        modelId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fieldname: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        type: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
        },
    }, {
        sequelize,
        timestamps: true,
        modelName: 'Media',
    });
    return Media;
};