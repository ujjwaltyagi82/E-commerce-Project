const userModel = require("../Model/userModel")
const { uploadFile } = require("../controller/aws")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')


//-------------------userRegisteration--------------
const createUser = async function (req, res) {
  try {
    const data = req.body

    const password = data.password
    const profileImage = req.files

    const uploadedImage = await uploadFile(profileImage[0])
    const cypt = await bcrypt.hash(password, 10)
    
    data.profileImage = uploadedImage
    data.password = cypt

    const register = await userModel.create(data)


    return res.status(201).send({status:true, message: "User created successfully", data: register })

  }
  catch (err) {
    return res.status(500).send({status:false, message: err.message })
  }

};

//------------userLogin----------------------
const loginUser = async function (req, res) {
  try {
    email = req.body.email
    myPassword = req.body.password


    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "please provide an Email !" });
    }

    if (!myPassword) {
      return res
        .status(400)
        .send({ status: false, message: "please enter password !" });
    }

    let user = await userModel.findOne({ email: email })

    if (!user) {
      return res.status(400).send({ status: false, message: "username or Password is not corerct" })
    } 

    let checkPass = await bcrypt.compare(myPassword, user.password)
    if (!checkPass) {
      return res.status(400).send({ status: false, message: "bcrypted password is invalid" })
    }


    let token = jwt.sign(
      {
        userId: user._id.toString(),
        batch: "project5",
        organisation: "group16",
      },
      "functionup-plutonium",
      { expiresIn: "2h" }
    );
    let Token = {
      userId: user._id.toString(),
      token: token
     }
    res.setHeader("Authorization", token);
    res.status(200).send({ status: true, message: "Success", data: Token });
  } 
  catch (err) {
   return res.status(500).send({ message: "server error", error: err.message });
  }
};

//--------------getUserDetails------------
const getUser = async function (req, res) {
  try {
    const userId = req.params.userId

    if(!(userId.match(/^[0-9a-fA-F]{24}$/)))
      return res.status(400).send({status:false, message:"Invalid userId given"})
    
    const user = await userModel.findById(userId)
    if (!user)
      return res.status(400).send({ status: false, message: "User not Found" })

      return res.status(200).send({ status: true, message: "Success", data: user })
  }
  catch (err) {
    res.status(500).send({status:false, message: "server error", error: err.message });
  }

}

//------------------profile update-----------------

const profileUpdate = async function (req, res) {
  try {
    let userId = req.params.userId
    let data = req.body
    let profileImage=req.files

    let {  password } = data
    
    if (password)
      data.password = await bcrypt.hash(password, 10)

    if (profileImage && profileImage.length > 0) {

        let uploadFileURL = await uploadFile(profileImage[0]);
        data.profileImage = uploadFileURL;
      }

    let updatedData = await userModel.findOneAndUpdate({ _id: userId }, data, { new: true })

      return res.status(200).send({ status: true, message: "updated sucessfully", data: updatedData })
  }
  catch (err) {
      return res.status(500).send({status: false, message: "server error", error: err.message });
  }

}



module.exports = { createUser, loginUser, getUser, profileUpdate }

