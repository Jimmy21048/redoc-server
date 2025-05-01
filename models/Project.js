const mongoose = require('mongoose')
const noteSchema = require('./Note')

const projectSchema = new mongoose.Schema({
    projectName: String,
    projectType: String,
    projectField: String,
    notes: [noteSchema]
})

module.exports = mongoose.model('Project', projectSchema)