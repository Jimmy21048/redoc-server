const express = require("express");
const db = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require("../middleware/Auth");
require('dotenv').config();

const users = db.collection("users");
const User = require('../models/user')
const { JWT_SIGN } = process.env

router.post('/signup', async (req, res) => {
    let { username, email, password } = req.body;

    try {
        const users = await User.find({ username: username })
        if(users.length !== 0) {
            return res.status(409).json({error: "Oops! username already exists"})
        }
    
        const hashedPwd = await bcrypt.hash(password, 10);
    
        const user = await User.create({ username: username, email: email, password: hashedPwd })

        return user && res.status(201).json({success: "Sign up successful"})
    }catch(error) {
        console.log("Sign up error: ", error)
        return res.status(500).json({error: "Sorry! an error occurred"})
    }
})

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body

        const users = await User.find({ username: username })
    
        if(users.length === 0) {
            return res.status(401).json({error: "incorrect username or password"});
        }
    
        const passwordMatch = await bcrypt.compare(password, users[0].password);
        
        if(passwordMatch === false) {
            return res.status(401).json({error: "incorrect username or password"});
        }
    
        const accessToken = sign({ username: users[0].username }, JWT_SIGN, {expiresIn : 1800});
        return res.status(202).json({success: "Logged in successfully", token: accessToken});
    }catch(error) {
        console.log("Login error: ", error)
        return res.status(500).json({error: "Sorry! an error occurred"})
    }
})

router.get('/auth', validateToken, (req, res) => {
    if(req.user) {
        return res.json({user: req.user});
    }
})

module.exports = router;