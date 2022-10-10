const express = require('express')
const mongoose = require('mongoose')
const route = require('./route/route')

const app = express()

app.use(express.json())

mongoose.connect('mongodb+srv://navneet:Navneet719@cluster0.3oclrwu.mongodb.net/group-16?retryWrites=true&w=majority',{useNewUrlParser:true})
.then(()=>{
    console.log("MongoDB connected")
}).catch(err=>{
    console.log(err.message);
})

app.use('/', route)

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))})