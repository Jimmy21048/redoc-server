const express = require('express')
const router = express.Router()
const db = require('../config')
const { validateToken } = require('../middleware/Auth')
const users = db.collection("users")
const { redisClient } = require('../redis.config')

const getNotes = async () => {
    try {
        let notes = await users.aggregate([
            { $unwind : "$projects" },
            { $match : { "projects.projectType" : "public" } },
            { $project : { "projects.notes" : 1, "username" : 1, "_id" : 0, "projects.projectName" : 1 } }
        ]).toArray()

        let randomNotes = await users.aggregate([
            { $unwind : "$randomNotes" },
            { $match : { "randomNotes.notesType" : "public" } },
            { $project : { "randomNotes.notesTitle" : 1, "randomNotes.notesContent" : 1, "username" : 1, "randomNotes.catchPhrase" : 1, "randomNotes.notesDate" : 1, "randomNotes.notesType": 1, "randomNotes.comments" : 1 } }
        ]).toArray()

        redisClient.set("socials", JSON.stringify({notes, randomNotes}))
        return {notes, randomNotes}
    } catch(err) {
        console.log("Redis Error 2 " + err)
        return null
    }
}

router.get('/', async (req, res) => {
    try {
        try {
            const cacheResults = await redisClient.get("socials")
            if(cacheResults) {
            
                res.json(JSON.parse(cacheResults))
                getNotes()
                return
            } 
        } catch(err) {
            console.log("Redis error "+ err)
            return
        }
        
        
        const results = await getNotes()
        return res.json(results)
    }catch(err) {
        console.log(err)
        return res.json("Could not complete operation")
    }



})

router.post('/comment', validateToken, async (req, res) => {
    const data = req.body
    data.user = req.user

    if(data.projectName) {
        await users.updateOne({ "projects.projectName" : data.projectName, "username": data.username }, {
            $push : { "projects.$.notes.$[note].comments" : {
                user : data.user,
                comment : data.comment
            } }
        }, {
            arrayFilters : [ {"note.notesTitle" : data.notesTitle} ]
        }).then(() => {

            users.aggregate([
                { $unwind : "$projects" },
                { $unwind : "$projects.notes" },
                { $match : { "projects.projectName" : data.projectName, "projects.notes.notesTitle" : data.notesTitle } },
                { $project : { "_id": 0, "projects.notes.comments" : 1, "username" : 1, "projects.projectName" : 1 } }
            ]).toArray().then((result) => {
                return res.json({success: result})
            }).catch(err => {
                console.log(err)
                return res.json("Could not complete operation")
            })
            
        }).catch(err => {
        console.log(err)
        return res.json("Could not complete operation")
    })
    } else {
        await users.updateOne({ "randomNotes.notesTitle" : data.notesTitle, "username" : data.username }, {
            $push : { "randomNotes.$.comments" : {
                user : data.user,
                comment : data.comment
            } }
        }).then(() => {
            users.aggregate([
                { $unwind : "$randomNotes" },
                { $match : { "randomNotes.notesTitle" : data.notesTitle } },
                { $project : {"randomNotes.comments" : 1 } }
            ]).toArray().then((result) => {
                return res.json({successRandoms: result })
            })
        }).catch(err => {
            console.log(err)
            return res.json("Could not complete operation")
        })
    }
    


})

module.exports = {router, getNotes }