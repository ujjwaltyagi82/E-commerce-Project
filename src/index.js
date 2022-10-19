
const express = require('express')
const mongoose = require('mongoose')
const route = require('./route/route')
const multer= require("multer");

const app = express()

app.use(express.json())
app.use(multer().any())

mongoose.connect('mongodb+srv://navneet:Navneet719@cluster0.3oclrwu.mongodb.net/group-16?retryWrites=true&w=majority',{useNewUrlParser:true})
.then(()=>{
    console.log("MongoDB connected")
}).catch(err=>{
    console.log(err.message);
})

app.use('/', route)

app.use((req, res, next) => {
    const error = new Error('/ Path not found /');
    return res.status(400).send({ status: 'ERROR', error: error.message })
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))})
