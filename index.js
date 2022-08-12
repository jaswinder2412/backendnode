 
const connectionMongo = require('./db')
const express = require('express')


connectionMongo();
const app = express(); 
var cors = require('cors')
app.use(cors())

app.use(express.json())
app.use('/api/auth',require('./Routes/auth'))
app.use('/api/notes',require('./Routes/notes'))


// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world')
})

app.listen(5000,()=>{
    console.log("Server Connection on 5000")
})