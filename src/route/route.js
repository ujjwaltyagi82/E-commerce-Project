const express = require('express')
const router = express.Router()
const {registerValidtion,updateUser}= require("../validation/validation")
const {authentication, authorization} = require('../middleware/auth')

const {creatUser,loginUser,getUser,profileUpdate}=require("../controller/userController")
const {creatProduct,getProductById} =require("../controller/productController")


//user API
router.post("/register", registerValidtion, creatUser)

router.post("/login", loginUser)

router.get('/user/:userId/profile', authentication, getUser)

router.put("/user/:userId/profile", authentication, authorization,updateUser, profileUpdate)

router.post("/products",  creatProduct)

router.get('/products/:productId', getProductById)





module.exports=router
