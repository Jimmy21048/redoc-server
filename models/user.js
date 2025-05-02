const mongoose = require('mongoose')
const projectSchema = require('./Project')
const noteSchema = require('./Note')
const peerSchema = require('./Peer')

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true},
    email: { type: String, },
    password: { type: String, required: true},
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'projectSchema' }],
    randomNotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'noteSchema' }],
    peers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'peerSchema' }],
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
module.exports = User
