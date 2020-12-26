import { mapFinderOptions } from "sequelize/types/lib/utils";

const fs = require("fs");
require('dotenv').config();
const db = require('./db');

const Funko = require('./models/FunkoModel')

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

      funkoInfo.map(async (funko) => {
        try {
          await Funko.create({
            handle: funko.handle,
            title: funko.title,
            imageName: funko.imageName,
            series: funko.series
          })
        } catch (error) {
          console.log('this fucked up')
        }
      })
    })

  // console.log(
  //       funkoInfo.filter((o => {
  //           return o.handle.includes('spider-man');
  //       }))
  // );

});
