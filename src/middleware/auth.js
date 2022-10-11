const jwt = require('jsonwebtoken')

const authentication = async function (req, res, next) {
    try {
        let token = req.header("Authorization")
        // if (!(token)) {
        //     token = req.headers["x-api-key"]
        // }
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
            //console.log(err)
            res.status(401).send({  status: false, msg: err.message });
          } else return res.status(500).send({  status: false, msg: err.message });
    }
}


module.exports={authentication}