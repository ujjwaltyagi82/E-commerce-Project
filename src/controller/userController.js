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
        // let fill = valid.filter((element) =>
        //     ["street", "city", "pincode"].includes(element)
        // );
        // if (!fill.length)
        //     return res.status(400).send({
        //         status: false,
        //         message: "Please enter valid field in address (street,city,pincode)",
        //     })
        // const register = await userModel.create(data)


        res.status(201).send({ msg: "User created successfully", data: register })

    }
    catch (err) {
        res.status(500).send({ msg: err })
    }

}
module.exports = { creatUser }

