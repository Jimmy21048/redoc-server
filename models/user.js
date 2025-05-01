const mongoose = require('mongoose')
const projectSchema = require('./Project')
const noteSchema = require('./Note')
const peerSchema = require('./Peer')

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    projects: [projectSchema],
    randomNotes: [noteSchema],
    peers: [peerSchema],
})

module.exports = mongoose.model('User', userSchema)