const { MongoClient } = require('mongodb');
require('dotenv').config

const client = new MongoClient(process.env.MONGO_URI)

const db = client.db(process.env.DB);

module.exports = db