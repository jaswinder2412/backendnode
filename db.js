
const mongoose = require("mongoose")
const MongoURI = "mongodb://localhost:27017/iNotebook";
const mongoconnections = ()=>{
mongoose.connect(MongoURI,(error,response)=>{
    console.log("Mongo DB Connected");
})}

module.exports = mongoconnections