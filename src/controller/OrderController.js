const orderModel = require('../Model/orderModel.js')
const cartModel = require('../Model/cartModel.js')
const { isValidBody, isValidStatus } = require('../validation/validation.js');




const createOrder = async function(req,res){
try{
    let userId = req.params.userId
    if (!userId) {
        return res.status(400).send({ status: false, message: "User ID is Required" });
    }

    if(!(userId.match(/^[0-9a-fA-F]{24}$/))){
        return res.status(400).send({status : false , message : "Please use a valid Object id"})
    }

    let data = req.body

    let { cartId, status, cancellable } = data

    if (!cartId)
    return res.status(400).send({ status: false, message: "Cart ID is required" })

    if(!(cartId.match(/^[0-9a-fA-F]{24}$/))){
        return res.status(400).send({status : false , message : "Please use a valid Object id"})
    }

    let findCart = await cartModel.findOne({ userId: userId })

    if (!findCart)
       return res.status(404).send({ status: false, message: `No such cart exist for ${userId}` })

    if (findCart.items.length === 0)
       return res.status(400).send({ status: false, message: "No Item in Cart" })

    if (status || typeof status == "string") {
        //checking if the status is valid
    if (isValidBody(status)) {
        return res.status(400).send({ status: false, message: " Please provide status" })
        }
    if (!isValidStatus(status))
        return res.status(400).send({ status: false, message: "Status should be one of 'pending', 'completed', 'cancelled'" });
    }

    if (cancellable || typeof cancellable == 'string') {
        if (validate.isValid(cancellable))
            return res.status(400).send({ status: false, message: "cancellable should not contain white spaces" });
        if (typeof cancellable == 'string') {
            //converting it to lowercase and removing white spaces
            cancellable = cancellable.toLowerCase().trim();
            if (cancellable == 'true' || cancellable == 'false') {
                //converting from string to boolean
                cancellable = JSON.parse(cancellable)
            } else {
                return res.status(400).send({ status: false, message: "Please enter either 'true' or 'false'" });
            }
        }
    }

    
    let totalQuantity = 0;
    for (let i = 0; i < findCart.items.length; i++)
        totalQuantity += findCart.items[i].quantity;


    data.userId = userId;
    data.items = findCart.items;
    data.totalPrice = findCart.totalPrice;
    data.totalItems = findCart.totalItems;
    data.totalQuantity = totalQuantity;

    let result = await orderModel.create(data);
    await cartModel.updateOne({ _id: findCart._id },{ items: [], totalPrice: 0, totalItems: 0 });

    return res.status(201).send({ status: true, message: "Success", data: result })

}catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}

const updateOrder = async function(req,res){



}


module.exports={createOrder,updateOrder}