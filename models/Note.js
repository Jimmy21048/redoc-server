const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    notesTitle: { type: String },
    notesType: { type: String },
    catchPhrase: { type: String },
    notesContent: [[{ type: String }]],
    notesDate: { type: String } 
})

module.exports = mongoose.model('Note', noteSchema)