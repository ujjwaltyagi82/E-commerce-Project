const cartModel = require('../Model/cartModel')
const userModel = require('../Model/userModel')
const productModel = require('../Model/productModel')
const { checkBody } = require('../validation/validation')


const createCart = async function (req, res) {
    const userId = req.params.userId
    const data = req.body

    if (!userId)
        return res.status(400).send({ status: false, message: 'userId is required' })

    if (!(userId.match(/^[0-9a-fA-F]{24}$/)))
        return res.status(400).send({ status: false, message: "Invalid userId given" })

    const checkUser = await userModel.findOne({ _id: userId })
    if (!checkUser)
        return res.status(400).send({ status: false, message: "user not found" })

    if (!checkBody(data))
        return res.status(400).send({ status: false, message: "Enter data to create cart" })

    let { productId, cartId, quantity } = data
    quantity = 1
    data.quantity = quantity

    if (!(productId.match(/^[0-9a-fA-F]{24}$/)))
        return res.status(400).send({ status: false, message: "Invalid productId given" })

    const checkProduct = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!checkProduct)
        return res.status(400).send({ status: false, message: "product not found" })

    const checkCart = await cartModel.findOne({ userId: userId })

    if (!checkCart) {
        if (cartId) {
            return res.status(400).send({ status: false, message: "First You have to create cart!" })
        }

        let objCart = { userId: userId, items: [{ productId: productId, quantity: quantity }], totalPrice: (checkProduct.price * quantity), totalItems: 1 }
        console.log(objCart)

        let newCart = await cartModel.create(objCart)
        return res.status(201).send({ status: true, message: "cart created successfully", data: newCart })
    }
    else {
        if (!(cartId.match(/^[0-9a-fA-F]{24}$/)))
            return res.status(400).send({ status: false, message: "Invalid cartId given" })

        let checkCartId = await cartModel.findById(cartId)
        if (!checkCartId)
            return res.status(400).send({ status: false, message: "cartId not found" })

        let productcheck = await productModel.findOne({ _id: productId, isDeleted: false })

        let qty = checkCartId.items
        for (let i = 0; i < qty.length; i++) {
            if (productcheck._id == productId) {
                let oldQty = qty[i].quantity
                console.log(oldQty)
                let newqty = oldQty + quantity
                console.log(newqty)
                let objCart1 = { userId: userId, items: [{ productId: productId, quantity: newqty }], totalPrice: (checkProduct.price * newqty), totalItems: qty.length }
                console.log(objCart1)
                let printQty = await cartModel.findOneAndUpdate({ _id: cartId }, objCart1, { new: true })
                return res.status(201).send({ status: true, message: "cart created successfully", data: printQty })


            }
        }
    }
}

// ==================getByUserId==============

const getByUserId= async function (req,res){
    const userId=req.params.userId
    let user=await userModel.findOne({_id:userId})
    if(!user){
        return res.status(400).send({status:false , message:"please use userId"})
    }
    let cart=await cartModel.findOne({userId:userId}).populate({path:'items.productId',select:{title:1,price:1,availableSizes:1}})
    if(!cart){
        return res.status(400).send({status:false , message:"dont find any product in cart"})
    }
    return res.status(200).send({status:true , message:"cart find", data:cart})

}

// ===============deletecart======

const cartDelete= async function (req,res){
    const userId=req.params.userId

    let user=await userModel.findOne({_id:userId})
    if(!user){
        return res.status(400).send({status:false , message:"please use userId"})
    }
    let cart=await cartModel.findOne({userId:userId})
    if(!cart){
        return res.status(400).send({status:false , message:"dont find any product in cart"})
    }

    let deleteCart=await cartModel.findOneAndUpdate({userId:userId},{totalItems:0,totalPrice:0,items:[]},{new:true})
    return res.status(200).send({status:true , message:"cart deleted", data:deleteCart})

}


module.exports = { createCart,getByUserId,cartDelete }