const express = require('express')
const router = express.Router()
const {registerValidtion}= require("../validation/validation")

const {creatUser,loginUser}=require("../controller/userController")



router.post("/register",registerValidtion,creatUser)

router.post("/login",loginUser)



module.exports=router


registerValidtion