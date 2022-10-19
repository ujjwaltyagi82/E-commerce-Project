const orderModel = require('../Model/orderModel.js')
const cartModel = require('../Model/cartModel.js')
const { isValidBody, isValidStatus, isValidRequestBody } = require('../validation/validation.js');
const userModel = require('../Model/userModel.js');




const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId
        if (!userId) {
            return res.status(400).send({ status: false, message: "User ID is Required" });
        }

        if (!(userId.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).send({ status: false, message: "Please use a valid Object id" })
        }

        let checkuser = await userModel.findOne({ _id: userId })

        if (!checkuser) {
            return res.status(400).send({ status: false, message: "User not found" })
        }
        let data = req.body

        let { cartId, status, cancellable } = data

        if (!cartId)
            return res.status(400).send({ status: false, message: "Cart ID is required" })

        if (!(cartId.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).send({ status: false, message: "Please use a valid Object id" })
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
        await cartModel.updateOne({ _id: findCart._id }, { items: [], totalPrice: 0, totalItems: 0 });

        return res.status(201).send({ status: true, message: "Success", data: result })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId
        const data = req.body
        let orderId = data.orderId

        if (!(userId.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).send({ status: false, message: "Please use a valid Object id" })
        }

        let user = await userModel.findOne({ _id: userId })


        if (!user) {
            return res.status(400).send({ status: false, message: "No user id found" })
        }

        let checkcart = await cartModel.findOne({ userId: userId })

        if (!checkcart) {
            return res.status(400).send({ status: false, message: "This cart is not for this user" })
        }

        let checkorder = await orderModel.findOne({ userId: userId })

        if (!checkorder) {
            return res.status(400).send({ status: true, message: "order no related to this user sorry" })
        }

        if (!(orderId.match(/^[0-9a-fA-F]{24}$/))) {
            return res.status(400).send({ status: false, message: "Please use a valid object id " })
        }

        let orderid = await orderModel.findOne({ _id: orderId })

        if (!orderid) {
            return res.status(400).send({ status: false, message: "Order not found use differnet id " })
        }

        if (!data.status) {
            return res.status(400).send({ status: false, message: "Status is a mandotry field " })
        }

        if (!isValidBody(data.status)) {
            return res.status(400).send({ status: false, message: " Please provide status" })
        }

        if (!isValidStatus(data.status)) {
            return res.status(400).send({ status: false, message: "Status should be one of 'pending', 'completed', 'cancelled'" });
        }

        if (orderid.status == "cancelled") {
            return res.status(400).send({ status: false, message: "Your order is already cancelled" })
        }

        if (orderid.status == "completed") {
            return res.status(400).send({ status: false, message: "your order is already completed" })
        }

        if (orderid.status == "pending") {
            return res.status(400).send({ status: false, message: "Your order is already in pending" })
        }


        if (data.status == "cancelled") {

            if (orderid.cancellable == true) {

                const updateOder = await orderModel.findOneAndUpdate({ _id: orderId }, data, { new: true })
                return res.status(200).send({ status: true, message: "Your order is cancelled", data: updateOder })


            } else {

                return res.status(400).send({ status: false, message: "Your order is not cancellable " })




            }

        }

        const updatedOrder1 = await orderModel.findOneAndUpdate({ _id: orderId }, data, { new: true })

        return res.status(200).send({ status: true, message: "Your Order is Completed sucessfully", data: updatedOrder1 })


    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }


}





module.exports = { createOrder, updateOrder }