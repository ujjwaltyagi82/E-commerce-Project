const express = require('express')
const router = express.Router()
const {registerValidtion}= require("../validation/validation")

const {creatUser}=require("../controller/userController")



router.post("/register",registerValidtion,creatUser)





module.exports=router


registerValidtion