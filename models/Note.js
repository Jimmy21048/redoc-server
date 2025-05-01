const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    notesTitle: String,
    notesType: String,
    catchPhrase: String,
    notesContent: [[String]],
    notesDate: String 
})

module.exports = mongoose.model('Note', noteSchema)