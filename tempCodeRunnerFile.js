const connectionToMongo = ()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("connected to mongo Successfullly");
    })
}