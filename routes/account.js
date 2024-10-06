const express = require('express');
const { validateToken } = require('../middleware/Auth');
const router = express.Router();
const db = require('../config');

const users = db.collection("users");

router.get('/myaccount', validateToken, async (req, res) => {
    const user = req.user;

    await users.findOne({ username: user })
    .then(result => {
        return res.json(result);
    }).catch(err => {
        console.log(err);
        return res.json({err: "could not complete operation"});
    })
})

router.post('/newproject', validateToken, async (req, res) => {
    const user = req.user;
    const data = req.body;

    await users.find({ username: user,  projects: { $exists: true} }).toArray()
    .then((result => {
        if(result.length === 0) {
            users.updateOne({ username: user }, { $set : { projects: [{ 
                projectName: data.projectName,
                projectType: data.projectType,
                projectField: data.projectField
             }] } }).then( async () => {
                await users.findOne({ username: user })
                .then((result) => {
                    return res.json({success: "project created", projects: result.projects})
                })
             }).catch(err => {
                console.log(err);
                return res.json({projectError: "could not complete operation"})
             })
        } else {
            for(let i = 0; i < result[0].projects.length; i++) {
                if(result[0].projects[i].projectName === data.projectName) {
                    return res.json({projectError: "Oops! Project name already exists"})
                }
            }
            
            users.updateOne({ username: user }, { $push : { projects : {
                projectName: data.projectName,
                projectType: data.projectType,
                projectField: data.projectField
            } } }).then( async() => {
                await users.findOne({ username: user })
                .then((result) => {
                    return res.json({success: "project created", projects: result.projects})
                })
                
             }).catch(err => {
                console.log(err);
                return res.json({projectError: "could not complete operation"})
             })
        }


    }))

    

})

router.post('/newnote', validateToken, async (req, res) => {
    const user = req.user;
    const data = req.body;

    if(data.attachProject.length > 0) {
        let note, project;
        await users.find({ username: user, projects : { $elemMatch : { projectName: data.attachProject, notes : { $exists: true, $elemMatch : { notesTitle : data.notesTitle } } } } }).toArray()
        .then((result) => {
            if(result.length === 0) {
                users.updateOne({ username: user, "projects.projectName" : data.attachProject }, { $push : {
                    "projects.$.notes" : {
                        notesTitle : data.notesTitle,
                        notesContent: ''
                    }
                } }).then( async() => {
                    const info = await users.findOne({ username: user })

                    //search for the specific note
                    for(let i = 0; i < info.projects.length; i++) {
                        if(info.projects[i].projectName === data.attachProject) {
                            for(let j = 0; j < info.projects[i].notes.length; j++) {
                                if(info.projects[i].notes[j].notesTitle === data.notesTitle) {
                                    note = info.projects[i].notes[j]
                                    project = info.projects[i]
                                    break;
                                }
                            }
                            break;
                        }
                    }
                    return res.json({success: "Note added", myNotes : {note , project}})
                    
                }).catch(err => {
                    console.log(err);
                    return res.json({projectError: "could not complete operation"})
                })
            } else {
                return res.json({projectError: "Oops! another note exists with this name"})
            }
            
        }).catch(err => {
            console.log(err);
            return res.json({projectError: "could not complete operation"})
        })
    } else {
        users.find({ username: user, randomNotes : { $exists : true, $elemMatch : { notesTitle : data.notesTitle } } }).toArray()
        .then((result) => {
            if(result.length === 0) {
                users.updateOne({ username: user }, { $push : { randomNotes : {
                    notesTitle : data.notesTitle,
                    notesType : data.notesType,
                    notesContent: ''
                } } }).then(async() => {
                    const info = await users.findOne({ username : user })
                    //search for note
                    for(let i = 0; i < info.randomNotes.length; i++) {
                        if(info.randomNotes[i].notesTitle === data.notesTitle) {
                            note = info.randomNotes[i];
                            break;
                        }
                    }
                    
                    return res.json({success: "Note added", myNotes : {note}})
                }).catch(err => {
                    console.log(err);
                    return res.json({projectError: "could not complete operation"})
                })
            } else {
                return res.json({projectError: "Oops! another note exists with this name"})
            }
        }).catch(err => {
            console.log(err);
            return res.json({projectError: "could not complete operation"})
        })

    }


})

router.post('/updatenotes', validateToken, async (req, res) => {
    const user = req.user
    const data = req.body
    console.log(data);
    if(data.project.length > 0) {
        await users.updateOne({
            username: user,
            "projects.projectName": data.project,
            "projects.notes.notesTitle" : data.notes
        }, {
            $set : {
                "projects.$[project].notes.$[note].notesContent" : data.data
            }
        }, {
            arrayFilters : [
                {"project.projectName" : data.project},
                {"note.notesTitle"  : data.notes}
            ]
        }).then(() => {
            return res.json({success : "note updated"})
        }).catch(err => {
            console.log(err);
            return res.json({projectError: "could not complete operation"})
        })
    } else {
        await users.updateOne({
            username: user,
            "randomNotes.notesTitle" : data.notes
        }, {
            $set : {
                "randomNotes.$[note].notesContent" : data.data
            }
        }, {
            arrayFilters : [
                { "note.notesTitle" :  data.notes}
            ]
        }).then(() => {
            console.log("success");
            return res.json({success : "note updated"})
        }).catch(err => {
            console.log(err);
            return res.json({projectError: "could not complete operation"})
        })
    }
    
})

module.exports = router;