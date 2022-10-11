const userModel=require("../Model/userModel")

// Validataion for empty request body
const checkBody = function (value) {
    if (Object.keys(value).length === 0) return false;
    else return true;
  };
  
  const isValidBody = function (value) {
    if (typeof value === "undefined" || value === "null") return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
  
  const isValidEmail = function (email) {
    let checkemail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    if (checkemail.test(email)) {
      return true;
    }
    return false;
  };
  
  const isValidMobileNumber = function (mobile) {
    let checkMobile = /^[6-9]\d{9}$/;
    if (checkMobile.test(mobile)) {
      return true;
    }
    return false;
  };
  
  const isValidPassword = function (password) {
    const re =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,15}$/; //for password space not allowed, also handles !password
    return re.test(password);
  };
  
  // Validation for length of characters
  const lengthOfCharacter = function (value) {
    if (!/^\s*(?=[a-zA-Z])[\a-z\A-Z\s]{3,64}\s*$/.test(value)) return false;
    else return true;
  };
  
  // validation for Profile image
  function isValidImage(value) {
    const regEx = /.+\.(?:(jpg|gif|png|jpeg|jfif))/; //It will handle all undefined, null, only numbersNaming, dot, space allowed in between
    const result = regEx.test(value);
    return result;
  }
  
  
  //======================================User registration validation====================================================
  const registerValidtion = async function(req,res,next){
      try {
          let data = req.body
          let { fname, lname, email, phone, password, address } = data
          let profileImage = req.files
  
          if (profileImage.length === 0) {
              return res.status(400).send({ status: false, message: "Please Upload the Profile Image" })
            }
          
          if (!isValidImage(profileImage[0].originalname)) {
              return res.status(400).send({status: false,message:"Please upload only image file with extension jpg, png, gif, jpeg"})
            }
  
          if (!checkBody(data) && !profileImage) {
              return res.status(400).send({ status: false, message: "Please input Parameters" })
            }
  
          if (!isValidBody(fname)) {
              return res.status(400).send({status: false, message: "Please provide first name"})
            }
          if (!lengthOfCharacter(fname)) {
              return res.status(400).send({status: false,message: "Please provide first name with right format"})
            }
  
          if (!isValidBody(lname)) {
              return res.status(400).send({status: false, message: "Please provide last name"})
            }
          if (!lengthOfCharacter(lname)) {
              return res.status(400).send({status: false, message: "Please provide last name with right format"})
            }
  
          if (email) 
          email = email.toLowerCase()
            if (!isValidBody(email)) {
              return res.status(400).send({ status: false, message: "Please enter email" })
            } 
            else if (!isValidEmail(email)) {
              return res.status(400).send({ status: false, message: "Email is not valid" })
            }
            const existEmail = await userModel.findOne({ email });
            if (existEmail) {
              return res.status(400).send({ status: false, message: "This Email is already in use" })
            }
  
            if (!phone) {
              return res.status(400).send({status: false, message: "Please enter mobile number"})
            }
            if (!isValidMobileNumber(phone)) {
              return res.status(400).send({status: false, message: "Please enter 10 digit indian number, eg. +91 9876xxxxxx"})
            }
            const existPhone = await userModel.findOne({ phone });
            if (existPhone) {
              return res.status(400).send({status: false, message: "This Mobile number is already in use"})
            }
            if (!isValidPassword(password)) {
              return res.status(400).send({status: false, message:"Please enter valid password  and length should be 8 to 15"})
            }
        
            if (!address) {
              return res.status(400).send({status: false, message: "Address is Mandatory"})
            }
        
            if (!address.shipping) {
              return res.status(400).send({status: false, message: "Please enter shipping address"})
            }
        
            if (!isValidBody(address.shipping.street)) {
              return res.status(400).send({
                status: false, message: "Please enter street in shipping address"})
            }
            if (!isValidBody(address.shipping.city)) {
              return res.status(400).send({status: false, message: "Please enter city in shipping address"})
            }
            if (!lengthOfCharacter(address.shipping.city)) {
              return res.status(400).send({status: false, message: "Please enter valid city in shipping address"})
            }
            if (!/^\d{6}$/.test(address.shipping.pincode)) {
              return res.status(400).send({status: false, message: "Please enter valid pincode in shipping address"})
            }
        
            if (!address.billing) {
              return res.status(400).send({status: false, message: "Please enter billing address"})
            }
        
            if (!isValidBody(address.billing.street)) {
              return res.status(400).send({status: false, message: "Please enter street in billing address"})
            }
            if (!isValidBody(address.billing.city)) {
              return res.status(400).send({status: false, message: "Please enter city in billing address"
              })
            }
            if (!lengthOfCharacter(address.billing.city)) {
              return res.status(400).send({status: false, message: "Please enter valid city in billing address"})
            }
            if (!/^\d{6}$/.test(address.billing.pincode)) {
              return res.status(400).send({status: false, message: "Please enter valid pincode in billing address"})
            }
          
  }catch(err){
      res.status(500).send({status:false, message:err.message})
  }
  next()
  }


  module.exports={registerValidtion,}













  //// validating address
  // const {shipping,billing}=req.body["address"]
  // if(!validator.isValidObject(address)){
  //     return res.status(400).send({status:false, message:"address can only be object type"})
  // }

  // let nestObj=["street","pincode","city"]
  // for(let key of nestObj){
  //     if(!validator.isValid(shipping[key])){
  //         return res.status(400).send({status:false, message:`${key} must be present in shipping field`})
  //     }
  //     if(!validator.isValid(billing[key])){
  //         return res.status(400).send({status:false, message:`${key} must be present in billing field`})
  //     }
  // }

  // // validating field present in billing and shipping fields
  // if(!validator.isLetters(shipping["city"]) || !validator.isLetters(billing["city"])){
  //     return res.status(400).send({status:false, message:"city can contains letters / String type only"})
  // }
  // if(!validator.isValid(shipping["street"]) || !validator.isValid(billing["street"])){
  //     return res.status(400).send({status:false, message:"street can be String type only"})
  // }
  // if(!validator.isValidPincode(shipping["pincode"]) || !validator.isValidPincode(billing["pincode"])){
  //     return res.status(400).send({status:false, message:"Invalid pincode"})
  // }

  // // Check for uniqueness for email and phone
  // const existedData = await userModel.find({$or:[{email},{phone}]})
  // for(let key of existedData){
  //     if(key["email"]==email.trim().toLowerCase()){
  //         return res.status(400).send({status:false, message:"Email is already taken"})
  //     }
  //     if(key["phone"]==phone.trim()){
  //         return res.status(400).send({status:false, message:"phone is already taken"})
  //     }

  // }