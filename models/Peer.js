const mongoose = require('mongoose')

const peerSchema = new mongoose.Schema({
    requestedPeers: [String],
    pendingPeers: [String]
})

module.exports = mongoose.model('Peer', peerSchema)