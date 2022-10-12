const productModel=require("../Model/productModel")
const { uploadFile } = require("../controller/aws")


const creatProduct = async function (req, res) {
    try {
      const data = req.body
      const productImage = req.files
      const uploadedImage = await uploadFile(productImage[0])
      data.productImage = uploadedImage

      const product = await productModel.create(data)
  
      return res.status(201).send({ msg: "product created successfully", data: product })
  
    }
    catch (err) {
      return res.status(500).send({ msg: err })
    }
  
  };


  const getProductById = async function (req, res) {
    try {
      const productId = req.params.productId
  
      if(!(productId.match(/^[0-9a-fA-F]{24}$/)))
        return res.status(400).send({status:false,message:"Invalid productId given"})
      
      const checkProduct = await productModel.findOne({_id:productId,isDeleted:false})
      if (!checkProduct)
        return res.status(400).send({ status: false, message: "product not Found" })
  
      return res.status(200).send({ status: false, message: "Success", data: checkProduct })
    }
    catch (err) {
      res.status(500).send({ message: "server error", error: err.message });
    }
  
  }

  const deleteProductById = async function(req,res){
    const productId = req.params.productId

    if(!(productId.match(/^[0-9a-fA-F]{24}$/)))
    return res.status(400).send({status:false,message:"Invalid productId given"})
    
    let productDeleted = await productModel.findOneAndUpdate({ _id: productId, isDeleted:false},{$set:{isDeleted:true, deletedAt: Date.now()}},{new:true})
    if(productDeleted){
      return res.status(200).send({status:true, message:'Product Deleted successfully'})
    }
    return res.status(404).send({status:false, message:'Product Not Found !'})
  }


  module.exports={creatProduct, getProductById, deleteProductById}

  
  
 