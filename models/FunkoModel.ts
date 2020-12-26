export {};

const { DataTypes } = require('sequelize');
const db = require('../db');

const Funko = db.define('funko', {
    handle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imageName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    series: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
})

module.exports = Funko;