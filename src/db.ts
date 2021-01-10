export {};

const { Sequelize } = require('sequelize');

const database = new Sequelize(process.env.DB_CONNECTION_STRING, {
    dialect: 'postgres'
});

module.exports = database;