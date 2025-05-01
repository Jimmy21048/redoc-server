const mongoose = require('mongoose')

const peerSchema = new mongoose.Schema({
    requestedPeers: [{ type: String }],
    pendingPeers: [{ type: String }]
})

module.exports = mongoose.model('Peer', peerSchema)