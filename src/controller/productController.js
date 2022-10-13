const productModel = require("../Model/productModel")
const { uploadFile } = require("../controller/aws")
const { lengthOfCharacter } = require('../validation/validation.js')

const createProduct = async function (req, res) {
  try {
    const data = req.body
    const productImage = req.files
    const uploadedImage = await uploadFile(productImage[0])
    data.productImage = uploadedImage

    let { availableSizes } = data
    availableSizes = availableSizes.split(",").map((s) => s.trim().toUpperCase());
    if (!availableSizes.every((e) => ["S", "XS", "M", "X", "L", "XXL", "XL"].includes(e)))
      return res.status(400).send({ status: false, message: "Invalid Available Sizes" })
    // console.log(availableSizes);
    data.availableSizes = availableSizes
    // if(!availableSizes.every((e)=>["S", "XS", "M", "X", "L", "XXL", "XL"].includes(e)))
    // return res.status(400).send({status:false, message: "Invalid Available Sizes" })

    // data.availableSizes = JSON.parse(availableSizes)


    const product = await productModel.create(data)

    return res.status(201).send({ msg: "product created successfully", data: product })

  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }

}

const getbyquery = async function (req, res) {
  try {

    let data = req.query

    if (!data) {

      let check = await productModel.find({ isDeletd: false })

      if (!check) {
        return res.status(400).send({ status: false, message: "No product found" })
      }
      return res.status(200).send({ status: true, message: "Product found succesfully", data: check })
    }
    else {

      let { name, size, priceGreaterthan, priceLessthan, priceSort } = data

      let condition = { isDeletd: false };

      if (name) {
        if (!lengthOfCharacter(name)) {
          return res.status(400).send({ status: false, message: "enter a valid name" })
        }
        condition.title = { $regex: name, $options: "i" }

      }

      if (priceGreaterthan) {
        if (!/^[+]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.match(priceGreaterthan)) {
          return res
            .status(400)
            .send({ status: false, message: "Enter valid Greater price" });
        }
        condition.price = { $gt: priceGreaterthan }
      }

      if (priceLessthan) {
        if (!/^[+]?([0-9]+\.?[0-9]*|\.[0-9]+)$/.match(priceLessthan)) {
          return res.status(400).send({ status: false, message: "Enter a valid less price" })
        }

        condition.price = { $lt: priceLessthan }
      }

      if (priceGreaterthan && priceLessthan) {
        condition["price"] = { $gt: priceGreaterthan, $lt: priceLessthan }
      }

      if (priceSort) {
        if (priceSort != 1 && priceSort != 1) {
          return res.status(400).send({ status: false, message: "Please use valid price sort" })
        }
      }
      let listproduct = await productModel.find(condition).sort({ price: priceSort })

      if (!listproduct) {
        return res.status(400).send({ status: false, message: "No any product find" })
      }

      return res.status(200).send({ status: true, message: "product found", data: listproduct })
    }

  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }

}


const getProductById = async function (req, res) {
  try {
    const productId = req.params.productId

    if (!(productId.match(/^[0-9a-fA-F]{24}$/)))
      return res.status(400).send({ status: false, message: "Invalid productId given" })

    const checkProduct = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!checkProduct)
      return res.status(400).send({ status: false, message: "product not Found" })

    return res.status(200).send({ status: true, message: "Success", data: checkProduct })
  }
  catch (err) {
    res.status(500).send({ message: "server error", error: err.message });
  }

}

const updateProduct = async function(req, res){
  try{const productId = req.params.productId
  const data = req.body
  let {title, description, price, isFreeShipping, style, availableSizes, installments} = data
  const obj={isDeleted:false}

  if(!ObjectId.isValid(productId))
  return res.status(400).send({status:false, message:'Invalid productId'})

  if(title || description || price || style || installments || isFreeShipping){
    
    obj.title=title
    obj.description=description
    obj.price=price
    obj.style=style
    
    obj.installments=installments
    obj.isFreeShipping=isFreeShipping

  }
  if(availableSizes){
    availableSizes = availableSizes.split(",").map((s) => s.trim().toUpperCase())
    if(!availableSizes.every((e)=>["S", "XS", "M", "X", "L", "XXL", "XL"].includes(e)))
    return res.status(400).send({status:false, message: "Invalid Available Sizes" })
    obj.availableSizes=availableSizes
  }

    const productImage = req.files
    if (productImage && productImage.length > 0) {
    const uploadedImage = await uploadFile(productImage[0])
    obj.productImage = uploadedImage
    }

    const updateProductDetails = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, obj,{ new: true })

    if(updateProductDetails){
      return res.status(200).send({status: true, message: "Product successfully updated", data: updateProductDetails})
    }
     return res.status(404).send({ status: false, msg: "Product not found" }) 
     }catch(err){
      return res.status(500).send({status:false, message:err.message})
     }
}

const deleteProductById = async function (req, res) {
  const productId = req.params.productId

  if (!(productId.match(/^[0-9a-fA-F]{24}$/)))
    return res.status(400).send({ status: false, message: "Invalid productId given" })

  let productDeleted = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true })
  if (productDeleted) {
    return res.status(200).send({ status: true, message: 'Product Deleted successfully' })
  }
  return res.status(404).send({ status: false, message: 'Product Not Found or Deleted !' })
}


module.exports = { createProduct, getProductById, getbyquery, updateProduct, deleteProductById }



