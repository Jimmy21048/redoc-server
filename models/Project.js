const mongoose = require('mongoose')
const noteSchema = require('./Note')

const projectSchema = new mongoose.Schema({
    projectName: { type: String },
    projectType: { type: String },
    projectField: { type: String },
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'noteSchema' }]
}, { timestamps: true })

const Project = mongoose.model('Project', projectSchema)
module.exports = Project