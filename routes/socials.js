const express = require('express')
const router = express.Router()
const db = require('../config')
const { validateToken } = require('../middleware/Auth')
const users = db.collection("users")

router.get('/', async (req, res) => {
    
    await users.aggregate([
        { $unwind : "$projects" },
        { $match : { "projects.projectType" : "public" } },
        { $project : { "projects.notes" : 1, "username" : 1, "_id" : 0, "projects.projectName" : 1 } }
    ]).toArray()
    .then((notes) => {
        users.aggregate([
            { $unwind : "$randomNotes" },
            { $match : { "randomNotes.notesType" : "public" } },
            { $project : { "randomNotes.notesTitle" : 1, "randomNotes.notesContent" : 1, "username" : 1, "randomNotes.notesDate" : 1, "randomNotes.notesType": 1, "randomNotes.comments" : 1 } }
        ]).toArray()
        .then((randomNotes) => {
            return res.json({notes : notes, randomNotes: randomNotes});
        }).catch(err => {
            console.log(err)
            return res.json("Could not complete operation")
        })
    }).catch(err => {
        console.log(err)
        return res.json("Could not complete operation")
    })


})

router.post('/comment', validateToken, async (req, res) => {
    const data = req.body
    data.user = req.user

    console.log(data)

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

module.exports = router