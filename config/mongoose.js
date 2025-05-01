require('dotenv').config()
const mongoose = require('mongoose')
const { MONGO_URI } = process.env

const mongooseConnection = async () => {
    try {
        if(!MONGO_URI) {
            return { error: "Error with env file or variable" }
        }

        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 30000,
            connectTimeoutMS: 60000
        })

        console.log(`MongoDB Connected with mongoose`);
        return {error: null}
    }catch(err) {
        console.log("Connection to MongoDB failed: ", err)
        return {error: "Could not connect to the database, try again later"}
    }
}

module.exports = mongooseConnection