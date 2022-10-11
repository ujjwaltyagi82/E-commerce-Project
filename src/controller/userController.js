const userModel = require("../Model/userModel")
const { uploadFile } = require("../controller/aws")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')



const creatUser = async function (req, res) {
    try {
        const data = req.body
           
        const password = data.password
        const profileImage = req.files
        const uploadedImage = await uploadFile(profileImage[0])
        const cypt = await bcrypt.hash(password, 10)
        data.profileImage = uploadedImage
        data.password = cypt
   
        const register = await userModel.create(data)


        return res.status(201).send({ msg: "User created successfully", data: register })

    }
    catch (err) {
        return res.status(500).send({ msg: err })
    }

};
const loginUser = async function (req, res) {
    try {
      email=req.body.email
      myPassword=req.body.password
       
      //if give nothing inside req.body
    //   if (Object.keys(data).length == 0) {
    //     return res.status(400).send({
    //       status: false,
    //       message: "Please provide email & password to login.",
    //     });
    //   }
    //   if (Object.keys(data).length > 2) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "Only email & password is required." });
    //   }
      //---------------------------------------------//
      //if no Email inside req.
      if (!email) {
        return res
          .status(400)
          .send({ status: false, message: "please provide an Email !" });
      }
      //if no password inside req.body
      if (!myPassword) {
        return res
          .status(400)
          .send({ status: false, message: "please enter password !" });
      }
    //   let bcrypt = await bcrypt.compareSynce(myPassword,pass.password)
      //-------------------------------------//
      let user = await userModel.findOne({ email: email });

      let checkPass = await bcrypt.compareSync(myPassword, user.password)
      console.log(checkPass)
      if(!checkPass){
        return res.status(400).send({status:false,message:"bcrypted password is invalid"})
      }
  
      //if not user
      

      if(!user){
        return res
          .status(400)
          .send({ status: false, message: "username or Password is not corerct" })
      }
    //   if (!user) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "username is not corerct" });
    //   }
    //   //if password not correct
    //   let pass = await userModel.findOne({ password: myPassword });
    //   if (!pass) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "password is not corerct" });
    //   }
    
      //---------------------//
      //success creation starting
  
      let token = jwt.sign(
        {
          userId: user._id.toString(),
          batch: "project5",
          organisation: "group16",
        },
        "functionup-plutonium",
        { expiresIn: "2h" }
      );
        let Token={
          token:token,
          userId:user._id.toString(),
          
        }
      res.setHeader("Authorization", token);
      res.status(200).send({ status: true, message: "Success", data: Token });
    } catch (err) {
      res.status(500).send({ message: "server error", error: err.message });
    }
  };

  const getUser = async function(req,res){
    const userId=req.params.userId
    const user = await userModel.findById(userId)
    if(!user)
    return res.status(400).send({status:false, message:"User not Found"})

    return res.status(200).send({status:false, message:"Success", data:user})
  }
module.exports = { creatUser,loginUser,getUser}

