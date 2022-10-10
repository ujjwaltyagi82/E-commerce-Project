const express = require('express')
const router = express.Router()

const {creatUser}=require("../controller/userController")



router.post("/register",creatUser)





module.exports=router