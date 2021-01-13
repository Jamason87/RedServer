const fs = require("fs");
require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');

let databaseOptions = (process.env.SSL !== 'true') ? {
    dialect: 'postgres',
} : {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        },
        options: {
          requestTimeout: 5000
        },
        pool: {
          max: 5,
          min: 0,
          idle: 30000,
          acquire: 30000
      }
    }
}

const db = new Sequelize(process.env.DATABASE_URL, databaseOptions);

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
      allowNull: true
  }
})

fs.readFile("./funko_pop.json", "utf8", (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  let funkoInfo = JSON.parse(data);

  db.authenticate()
    .then(() => db.sync({ alter: true })) // TODO: Remove alter true
    .then(() => {
      console.log(funkoInfo.length);

      console.log(funkoInfo[0])

      let count = 0;
      funkoInfo.map(async (funko) => {
        count++;
        if (count < 9000) {
          try {
            Funko.create({
              handle: funko.handle,
              title: funko.title,
              imageName: funko.imageName,
              series: funko.series
            })
          } catch (error) {
            console.log('Something went wrong')
            console.log(error)
          }
        }
      })
    })

  // console.log(
  //       funkoInfo.filter((o => {
  //           return o.handle.includes('spider-man');
  //       }))
  // );

});
