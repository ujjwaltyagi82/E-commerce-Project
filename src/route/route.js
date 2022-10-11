const express = require('express')
const router = express.Router()
const {registerValidtion}= require("../validation/validation")
const {authentication} = require('../middleware/auth')

const {creatUser,loginUser,getUser}=require("../controller/userController")



router.post("/register",registerValidtion,creatUser)

router.post("/login",loginUser)

router.get('/user/:userId/profile',authentication, getUser)



module.exports=router


registerValidtion