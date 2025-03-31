const express = require('express')
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');

app.use(express.json());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: process.env.FRONT_END,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "accessToken"]
}))

const client = new MongoClient(process.env.MONGO_URI)

const authRouter = require('./routes/signup');
app.use('/sign', authRouter);

const accRouter = require('./routes/account');
app.use('/account', accRouter);

const socialsRouter = require('./routes/socials');
app.use('/socials', socialsRouter.router);

client.connect()
.then(() => {
    console.log("Connection successful");
    app.listen(process.env.SERVER_PORT || 3000, (err) => {
        if(err) {
            return console.log(err);
        }
        console.log(`Server up and running at port ${process.env.SERVER_PORT}`)
    })
})
.catch((err) => {
    console.log(err);
})

