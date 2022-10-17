const cartModel = require('../Model/cartModel')
const userModel = require('../Model/userModel')
const productModel = require('../Model/productModel')
const { checkBody } = require('../validation/validation')


const createCart = async function(req,res){
    const userId = req.params.userId
    const data = req.body

    if(!userId)
    return res.status(400).send({status:false, message:'userId is required'})

    if (!(userId.match(/^[0-9a-fA-F]{24}$/)))
    return res.status(400).send({ status: false, message: "Invalid userId given" })

    const checkUser = await userModel.findOne({_id:userId})
    if(!checkUser)
    return res.status(400).send({ status: false, message: "user not found" })

    if(!checkBody(data))
    return res.status(400).send({ status: false, message: "Enter data to create cart" })

    let {productId, cartId, quantity} = data
    // quantity=1
    // data.quantity=quantity

    if (!(productId.match(/^[0-9a-fA-F]{24}$/)))
    return res.status(400).send({ status: false, message: "Invalid productId given" })

    const checkProduct = await productModel.findOne({_id:productId, isDeleted:false})
    if(!checkProduct)
    return res.status(400).send({ status: false, message: "product not found" })

    const checkCart = await cartModel.findOne({userId:userId})

    if(!checkCart){
        if(cartId){
        return res.status(400).send({ status: false, message: "First You have to create cart!" })
    }

    // let totalPrice = checkProduct.price*quantity
     
    let objCart = {userId:userId,items:[{productId:productId,quantity:quantity}],totalPrice:(checkProduct.price*quantity),totalItems:1}
    console.log(objCart)

    let newCart = await cartModel.create(objCart)
    return res.status(201).send({status:true, message:"cart created successfully", data:newCart})
    }
    else{
        if (!(cartId.match(/^[0-9a-fA-F]{24}$/)))
        return res.status(400).send({ status: false, message: "Invalid cartId given" })
        
        let checkCartId = await cartModel.findById(cartId)
        if(!checkCartId)
        return res.status(400).send({ status: false, message: "cartId not found" })

        // quantity=1
        // data.quantity=quantity
        let qty = Number(checkCartId["quantity"])
        console.log(qty);

        // let count = await cartModel.findOneAndUpdate({productId:productId},{$set:{quantity:quantity+1}})
        const count = await cartModel.findOneAndUpdate({ productId: productId}, { $inc: { quantity: qty } }, { new: true })

        let num =count.quantity
        console.log(num)
        console.log(count)
        const checkProduct = await productModel.findOne({_id:productId, isDeleted:false})

        let objCart1 = {userId:userId,items:[{productId:productId,quantity:num}],totalPrice:(checkProduct.price*quantity),totalItems:1}
        console.log(objCart1);
        let oldCart = await cartModel.create(objCart1)
        return res.status(201).send({status:true, message:"cart created successfully", data:oldCart})

    
    }





}


module.exports={createCart}