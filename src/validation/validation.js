const productModel = require("../Model/productModel");
const userModel = require("../Model/userModel")

// Validataion for empty request body
const checkBody = function (value) {
  return Object.keys(value).length > 0;
};

const isValidBody = function (value) {
  if (typeof value === "undefined" || value === "null") return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
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

const pinValid = (value) => {
  let pinregex = /^\d{6}$/;
  if (pinregex.test(value))
    return true;
}

const addressValid = (value) => {
  let streetRegex = /^[#.0-9a-zA-Z\s,-]+$/;
  if (streetRegex.test(value))
    return true;
}

function inrRegex(input) {
  let regex = /INR/;
  return regex.test(input);
}

function useRegex(input) {
  let regex = /₹/;
  return regex.test(input);
}

function numRegex(input) {
  let regex = /[0-9].[0-9]/;
  return regex.test(input);
}

 function isValidStatus(status){
  return ['pending', 'completed', 'cancelled'].includes(status);
}
//======================================User registration validation====================================================
const registerValidtion = async function (req, res, next) {
  try {
    let data = req.body
    let { fname, lname, email, phone, password, address } = data
    let profileImage = req.files

    if (!checkBody(data) && !profileImage) {
      return res.status(400).send({ status: false, message: "Please input Parameters" })
    }

    if (profileImage.length === 0) {
      return res.status(400).send({ status: false, message: "Please Upload the Profile Image" })
    }

    if (!isValidImage(profileImage[0].originalname)) {
      return res.status(400).send({ status: false, message: "Please upload only image file with extension jpg, png, gif, jpeg" })
    }

    

    if (!isValidBody(fname)) {
      return res.status(400).send({ status: false, message: "Please provide first name" })
    }
    if (!lengthOfCharacter(fname)) {
      return res.status(400).send({ status: false, message: "Please provide first name with right format" })
    }

    if (!isValidBody(lname)) {
      return res.status(400).send({ status: false, message: "Please provide last name" })
    }
    if (!lengthOfCharacter(lname)) {
      return res.status(400).send({ status: false, message: "Please provide last name with right format" })
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
      return res.status(400).send({ status: false, message: "Please enter mobile number" })
    }
    if (!isValidMobileNumber(phone)) {
      return res.status(400).send({ status: false, message: "Please enter 10 digit indian number, eg. +91 9876xxxxxx" })
    }
    const existPhone = await userModel.findOne({ phone });
    if (existPhone) {
      return res.status(400).send({ status: false, message: "This Mobile number is already in use" })
    }
    if (!isValidPassword(password)) {
      return res.status(400).send({ status: false, message: "Please enter valid password  and length should be 8 to 15" })
    }

    if (req.body.address) {
      req.body.address = JSON.parse(address)
      let { shipping, billing } = req.body.address

      // validation for Shipping address
      if (!shipping)
        return res.status(400).send({ status: false, message: "Please enter shipping address" });
      if (shipping.street) {    // validation for street
        shipping.street = shipping.street.trim();
        if (!isValidBody(shipping.street))
          return res.status(400).send({ status: false, message: "Shipping street name must be present" });
        if (!addressValid(shipping.street))
          return res.status(400).send({ status: false, message: "Please enter valid shipping street name" });
      } else {
        return res.status(400).send({ status: false, message: "Shipping Street name is required" })
      }

      if (shipping.city) {    // validation for city
        shipping.city = shipping.city.trim();
        if (!isValidBody(shipping.city))
          return res.status(400).send({ status: false, message: "Shipping city name must be present" });
        if (!lengthOfCharacter(shipping.city))
          return res.status(400).send({ status: false, message: "Please enter valid shipping city name" });
      } else {
        return res.status(400).send({ status: false, message: "Shipping  City name is required" })
      }

      // validation for pincode
      if (shipping.pincode) {
        if (!isValidBody(shipping.pincode))
          return res.status(400).send({ status: false, message: "Shipping pincode must be present" });
        if (!pinValid(shipping.pincode))
          return res.status(400).send({ status: false, message: "Shipping pincode is not valid" });
      } else {
        return res.status(400).send({ status: false, message: "Shipping  Pincode is required" })
      }


      // validation for Billing address
      if (!billing)
        return res.status(400).send({ status: false, message: "Please enter billing address" });
      if (billing.street) {    // validation for street
        billing.street = billing.street.trim();
        if (!isValidBody(billing.street))
          return res.status(400).send({ status: false, message: "Billing street name must be present" });
        if (!addressValid(billing.street))
          return res.status(400).send({ status: false, message: "Please enter valid billing street name" });
      } else {
        return res.status(400).send({ status: false, message: "Billing Street name is required" })
      }

      // validation for city
      if (billing.city) {
        billing.city = billing.city.trim();
        if (!isValidBody(billing.city))
          return res.status(400).send({ status: false, message: "Billing city name must be present" });
        if (!lengthOfCharacter(billing.city))
          return res.status(400).send({ status: false, message: "Please enter valid billing city name" });
      } else {
        return res.status(400).send({ status: false, message: "Billing city name is required" })
      }

      // validation for city
      if (billing.pincode) {
        if (!isValidBody(billing.pincode))
          return res.status(400).send({ status: false, message: "Billing pincode must be present" });
        if (!pinValid(billing.pincode))
          return res.status(400).send({ status: false, message: "Billing pincode is not valid" });
      } else {
        return res.status(400).send({ status: false, message: "Billing pincode is required" })
      }

    } else {
      return res.status(400).send({ status: false, message: "Please enter address" })
    }

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
  next()
}

//==========================================update validation=============================================================================
const updateUser = async function (req, res, next) {
  try {
    let userId = req.params.userId
    let data = req.body
    let { fname, lname, email, phone, password, address } = data
    let profileImage = req.files

    if (!(userId.match(/^[0-9a-fA-F]{24}$/)))
      return res.status(400).send({ status: false, message: "Invalid userId given" })


    if (!checkBody(data) && !profileImage) {
      return res.status(400).send({ status: false, message: "Please input Parameters" })
    }

    if (fname) {
      if (!isValidBody(fname)) {
        return res.status(400).send({ status: false, message: "Enter valid firstName" });
      }
      if (!lengthOfCharacter(fname)) {
        return res.status(400).send({ status: false, message: "Please provide first name with right format" })
      }
    }

    if (lname) {
      if (!isValidBody(lname)) {
        return res.status(400).send({ status: false, message: "Please provide last name" })
      }
      if (!lengthOfCharacter(lname)) {
        return res.status(400).send({ status: false, message: "Please provide last name with right format" })
      }
    }

    if (email) {
      email = email.toLowerCase()
      if (!isValidBody(email)) {
        return res.status(400).send({ status: false, message: "Please enter email" })
      }
      else if (!isValidEmail(email)) {
        return res.status(400).send({ status: false, message: "Email is not valid" })
      }
      const existEmail = await userModel.findOne({ email });
      if (existEmail) {
        return res.status(400).send({ status: false, message: `${(email)}This Email is already in use` })
      }
    }

    if (phone) {
      if (!isValidMobileNumber(phone)) {
        return res.status(400).send({ status: false, message: "Please enter 10 digit indian number, eg. +91 9876xxxxxx" })
      }
      const existPhone = await userModel.findOne({ phone });
      if (existPhone) {
        return res.status(400).send({ status: false, message: `${phone}This Mobile number is already in use` })
      }
    }
    if (password) {
      if (!isValidPassword(password)) {
        return res.status(400).send({ status: false, message: "Please enter valid password  and length should be 8 to 15" })
      }
    }
    if (address) {
      data.address = JSON.parse(address);
    
    if (!isValidBody(data.address)) {
      return res.status(400).send({ status: false, message: "Please enter a valid address" })
    }
    if (typeof data.address != "object") {
      return res.status(400).send({ status: false, message: "Address must be present in object" })
    }

    let { shipping, billing } = data.address
    if (!isValidBody(shipping)) {
      return res.status(400).send({ status: false, message: "Please enter a valid shipping address" })
    }
    if (typeof shipping != "object") {
      return res.status(400).send({ status: false, message: "Shipping address must be A object" })
    }
    if (!isValidBody(shipping.street)) {
      return res.status(400).send({ status: false, message: "Please enter a valid street" })
    }
    if (!lengthOfCharacter(shipping.city)) {
      return res.status(400).send({ status: false, message: "Please enter valid city in shipping address" })
    }
    if (!pinValid(shipping.pincode)) {
      return res.status(400).send({ status: false, message: "Please enter valid pincode in shipping address" })
    }
    //---------------------------------------------------------------
    if (!isValidBody(billing)) {
      return res.status(400).send({ status: false, message: "Please enter a valid billing address" })
    }

    if (typeof billing != "object") {
      return res.status(400).send({ status: false, message: "Please enter address in object" })
    }

    if (!isValidBody(billing.street)) {
      return res.status(400).send({ status: false, message: "Please enter street in billing address" })
    }
    if (!isValidBody(billing.city)) {
      return res.status(400).send({
        status: false, message: "Please enter city in billing address"
      })
    }
    if (!lengthOfCharacter(billing.city)) {
      return res.status(400).send({ status: false, message: "Please enter valid city in billing address" })
    }
    if (!pinValid(billing.pincode)) {
      return res.status(400).send({ status: false, message: "Please enter valid pincode in billing address" })
    }
  }
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
  next()
}

//==========================createProductValidtion=============================

const productValidation = async function (req, res, next) {
  try {
    let data = req.body
    let { availableSizes, currencyId, currencyFormat, title, description, style, price } = data

    if (!checkBody(data)) 
      return res.status(400).send({ status: false, message: "Please input Parameters" })

    if (!isValidBody(title))
      return res.status(400).send({ status: false, message: 'Title is required' })

    if (await productModel.findOne({ title: title }))
      return res.status(400).send({ status: false, message: 'Title must be unique' })

    if (!isValidBody(description))
      return res.status(400).send({ status: false, message: 'description is required' })

    if (!lengthOfCharacter(description))
      return res.status(400).send({ status: false, message: 'description must be in string' })

    if (!lengthOfCharacter(style))
      return res.status(400).send({ status: false, message: 'Style must be in string' })

    if (!isValidBody(price))
      return res.status(400).send({ status: false, message: 'price is required' })

    if (!numRegex(price))
      return res.status(400).send({ status: false, message: 'Price must be in number' })

    availableSizes = availableSizes.split(",").map((s) => s.trim().toUpperCase());

    if (!availableSizes.every((e) => ["S", "XS", "M", "X", "L", "XXL", "XL"].includes(e)))
      return res.status(400).send({ status: false, message: "Invalid Available Sizes" })

    data.availableSizes = availableSizes

    if (currencyId !== "INR") {
      if (!inrRegex(currencyId))
        return res.status(400).send({ status: false, message: "CurrencyId must be in INR" })

      data.currencyId = currencyId
    }

    if (currencyFormat !== "₹") {
      if (!useRegex(currencyFormat))
        return res.status(400).send({ status: false, message: "currencyFormat must be in ₹" })

      data.currencyFormat = currencyFormat
    }
    next()
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }

 

}

module.exports = { registerValidtion,numRegex, updateUser, isValidBody, inrRegex, useRegex, isValidStatus, isValidImage, checkBody, productValidation,isValidRequestBody}
