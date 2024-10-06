const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "accessToken"]
}))


const uri = 'mongodb://localhost:27017/'
const client = new MongoClient(uri)

const authRouter = require('./routes/signup');
app.use('/sign', authRouter);

const accRouter = require('./routes/account');
app.use('/account', accRouter);

client.connect()
.then(() => {
    console.log("Connection succesful");
    app.listen(process.env.SERVER_PORT || 3001, (err) => {
        if(err) {
            return console.log(err);
        }
        console.log(`Server up and running at port ${process.env.SERVER_PORT}`)
    })
})
.catch((err) => {
    console.log(err);
})

