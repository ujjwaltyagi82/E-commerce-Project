const jwt = require('jsonwebtoken');
const userModel = require('../Model/userModel');

const authentication = async function (req, res, next) {
    try {
        let token = req.header("Authorization")
        if (!(token)) {
            return res.status(401).send({ status: false, msg: "Token must be entered" })
        }
        const bearer = token.split(' ');
        const bearerToken = bearer[1];
        let decodedtoken = jwt.verify(bearerToken, "functionup-plutonium")
        if (!(decodedtoken)){
            return res.status(401).send({ status: false, msg: "Invalid Token" })
        } 
        req.decodedToken = decodedtoken
        res.setHeader("Authorization", token)
        next()
    }
    catch (err) {
        if (err.name === "JsonWebTokenError" || err.message==="jwt expired") {
            res.status(401).send({  status: false, msg: err.message });
          } else return res.status(500).send({  status: false, msg: err.message });
    }
}

const authorization = async function(req, res,next){
try{    
    const decoded = req.decodedToken
    const userId= req.params.userId

    if(userId)
    {
        if(!(userId.match(/^[0-9a-fA-F]{24}$/)))
        return res.status(400).send({status:false,message:"Invalid bookId given"})
        
        const user = await userModel.findById(userId)
        
        if(!user)
        return res.status(404).send({status:false,message:"Book not found or deleted !"})

        if(decoded.userId !== userId.toString())
        return res.status(403).send({status:false,message:"Unauthorised access"})

    }else
        return res.status(400).send({status:false,message:"User Id Required"})
}catch(err){
    return res.status(500).send({status:false, message:err.message})
}
next()

    }


module.exports={authentication, authorization}