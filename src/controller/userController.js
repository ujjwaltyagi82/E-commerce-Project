const userModel = require("../Model/userModel")
const { uploadFile } = require("../controller/aws")
const bcrypt = require("bcrypt")



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
      data = req.body;
      let userName = data.email;
      let myPassword = data.password;
       
      //if give nothing inside req.body
      if (Object.keys(data).length == 0) {
        return res.status(400).send({
          status: false,
          message: "Please provide email & password to login.",
        });
      }
      if (Object.keys(data).length > 2) {
        return res
          .status(400)
          .send({ status: false, message: "Only email & password is required." });
      }
      //---------------------------------------------//
      //if no Email inside req.
      if (!userName) {
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
  
      //if not user
      let user = await userModel.findOne({ email: userName,password: myPassword });

      if(!user.email || !user.password){
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
      let bcrypt = await bcrypt.compareSync(myPassword,pass.password)
      if(!bcrypt){
        return res.status(400).send({status:falsr,message:"bcrypted password is invalid"})
      }
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
      res.status(200).send({ status: true, message: "Success", data: Token });
    } catch (err) {
      res.status(500).send({ message: "server error", error: err });
    }
  };
module.exports = { creatUser,loginUser}

