export {};

require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser')
const validateSession = require('./middleware/validateSession')

const controllers = require('./controllers')

app.use(express.json());
app.use(require('./middleware/headers'));
app.use(bodyParser.json())

app.use('/user', controllers.User)
app.use('/funko', controllers.Funko)
app.use('/collection', controllers.Collection)
app.use('/wishlist', validateSession, controllers.Wishlist)

db.authenticate()
    .then(() => db.sync({ alter: true})) // TODO: Remove alter true
    .then(() => {
        app.listen(process.env.PORT, () => console.log(`[Server: ] App is listening on Port ${process.env.PORT}`));
    })
    .catch((err) => {
        console.log("[Server: ] Could not connect to database.");
        console.log(err)
    })