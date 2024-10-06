const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27017/'
const database = 'redoc'

const client = new MongoClient(uri)

const db = client.db(database);

module.exports = db