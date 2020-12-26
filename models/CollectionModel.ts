export {};

const { DataTypes } = require('sequelize');
const db = require('../db');

const Collection = db.define('collection', {
    owner_ID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    wishlist: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    funkos: {
        type: DataTypes.ARRAY(DataTypes.INTEGER)
    }
})

module.exports = Collection;