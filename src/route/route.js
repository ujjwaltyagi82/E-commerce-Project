const express = require('express')
const router = express.Router()
const {registerValidtion}= require("../validation/validation")
const {authentication} = require('../middleware/auth')

const {creatUser,loginUser,getUser,profileUpdate}=require("../controller/userController")



router.post("/register",registerValidtion,creatUser)

router.post("/login",loginUser)

router.get('/user/:userId/profile',authentication, getUser)

router.put("/user/:userId/profile",profileUpdate)



module.exports=router


registerValidtion