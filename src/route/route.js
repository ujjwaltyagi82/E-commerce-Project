const express = require('express')
const router = express.Router()
const {registerValidtion,updateUser, productValidation}= require("../validation/validation")
const {authentication, authorization} = require('../middleware/auth')

const {createUser,loginUser,getUser,profileUpdate}=require("../controller/userController")
const {createProduct,getProductById, getbyquery, updateProduct, deleteProductById} =require("../controller/productController")
const {createCart,getByUserId,cartDelete,updatecart} =  require('../controller/cartController')


//=======================user API==================================
router.post("/register", registerValidtion, createUser)

router.post("/login", loginUser)

router.get('/user/:userId/profile', authentication, getUser)

router.put("/user/:userId/profile", authentication, authorization,updateUser, profileUpdate)

//====================Product Api=====================================
router.post("/products", productValidation, createProduct)

router.get('/products', getbyquery)

router.get('/products/:productId', getProductById)

router.put('/products/:productId', updateProduct)

router.delete('/products/:productId', deleteProductById)

//===================cartApi=======================================

router.post("/users/:userId/cart",authentication, authorization, createCart)

router.get('/users/:userId/cart',authentication, authorization, getByUserId)

router.delete('/users/:userId/cart',authentication, authorization, cartDelete)

router.put('/users/:userId/cart',authentication, authorization, updatecart)





module.exports=router
