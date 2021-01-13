export {};

const { Sequelize } = require('sequelize');

let databaseOptions = (process.env.SSL !== 'true') ? {
    dialect: 'postgres',
} : {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
}

const database = new Sequelize(process.env.DATABASE_URL, databaseOptions);

module.exports = database;