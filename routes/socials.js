const express = require('express')
const router = express.Router()
const db = require('../config')
const users = db.collection("users")

router.get('/', async (req, res) => {
    
    db.find()
})

module.exports = router