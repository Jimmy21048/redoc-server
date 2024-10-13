const express = require("express");
const db = require('../config');
const router = express.Router();
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require("../middleware/Auth");
require('dotenv').config();

const users = db.collection("users");

router.post('/signup', async (req, res) => {
    let data = req.body;

    const currentUsers = await users.find({ username: data.username }).toArray();
    if(currentUsers.length !== 0) {
        return res.json({error: "Oops! username already exists"})
    }

    const hashedPwd = await bcrypt.hash(data.password, 10);
    data = {...data, password: hashedPwd};

    users.insertOne({ username: data.username, email: data.email, password: data.password })
    .then(() => {
        return res.json({success: "user successfully registered, Login"});
    }).catch(err => {
        console.log(err);
        return res.json({error: "user not registered"});
    })
})

router.post('/login', async (req, res) => {
    const data = req.body;

    const currentUsers = await users.find({ username: data.username }).toArray();

    if(currentUsers.length === 0) {
        return res.json({error: "incorrect username or password"});
    }

    const passwordMatch = await bcrypt.compare(data.password, currentUsers[0].password);
    
    if(passwordMatch === false) {
        return res.json({error: "incorrect username or password"});
    }

    const accessToken = sign({ username: currentUsers[0].username }, process.env.JWT_SIGN, {expiresIn : 1800});
    return res.json({success: "Logged in successfully", token: accessToken});

})

router.get('/auth', validateToken, (req, res) => {
    if(req.user) {
        return res.json({user: req.user});
    }
})

module.exports = router;