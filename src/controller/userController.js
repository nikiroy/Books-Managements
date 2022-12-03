//--------------------------------Importing models-------------------------------------//
const userModel=require('../models/userModel')
const {validName,validTitle,isValid,validEmail,validPhone,isValidPassword,isValidPincode}=require('../validation/validation')
const JWT = require('jsonwebtoken')


//---------------------------------Create User------------------------------------------//


const createUser=async function(req,res){
    try{ 
    const data=req.body
    const {title,name,phone,email,password,address}=data
    if(Object.keys(data)==0) return res.status(400).send({status:false, message:"No data given for creation"})

    if(!title) return res.status(400).send({status:false, message:"Title is mandatory"})
    if(!isValid(title)) return res.status(400).send({status:false, message:"Title can't be empty"})
    if(!validTitle(title)) return res.status(400).send({status:false, message:"Invalid Title"})

    if(!name) return res.status(400).send({status:false, message:"Name is mandatory"})
    if(!isValid(name)) return res.status(400).send({status:false, message:"Name can't be empty"})
    if(!validName(name)) return res.status(400).send({status:false, message:"Name can only take alphabets"})

    if(!phone) return res.status(400).send({status:false, message:"Phone is mandatory"})
    if(!isValid(phone)) return res.status(400).send({status:false, message:"Phone can't be empty"})
    if(!validPhone(phone)) return res.status(400).send({status:false, message:"Invalid Phone"})
    const phoneExist=await userModel.findOne({phone:phone})
    if(phoneExist) return res.status(400).send({status:false, message:"Phone No. already registered"})

    if(!email) return res.status(400).send({status:false, message:"Email is mandatory"})
    if(!isValid(email)) return res.status(400).send({status:false, message:"Email can't be empty"})
    if(!validEmail(email)) return res.status(400).send({status:false, message:"Invalid Email"})
    const emailExist=await userModel.findOne({email:email})
    if(emailExist) return res.status(400).send({status:false,message:"Email Id already registered"})

    if(!password) return res.status(400).send({status:false, message:"Password is mandatory"})
    if(!isValid(password)) return res.status(400).send({status:false, message:"Password can't be empty"})
    if(!isValidPassword(password)) return res.status(400).send({status:false, message:"Password should be between 8 to 15 characters"})

    if(address){
        if(typeof address!=="object") return res.status(400).send({status:false, message:"Address is in wrong format"})
        if(Object.keys(address)==0) return res.status(400).send({status:false, message:"No Address given"})
        if(address.street && !isValid(address.street)) return res.status(400).send({status:false,message:"Street is in wrong format"})
        if(address.city && !isValid(address.city)) return res.status(400).send({status:false, message:"City is in wrong format"})
        if(address.pincode && !isValid(address.pincode)) return res.status(400).send({status:false, message: "Pincode is in wrong format"})
        if(address.pincode && !isValidPincode(address.pincode)) return res.status(400).send({status:false, message: "Invalid Pincode"})
    }

    const userCreated=await userModel.create(data)
    return res.status(201).send({status:true, message:"Success", data:userCreated})
}
catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}



//-----------------------------user login-------------------------------------------------//
const loginUser = async function (req, res) {
    try {
        let email =req.body.email;
        let password =req.body.password
    
        if (Object.keys(req.body).length == 0) { return res.status(400).send({ status: false, message: "body is empty" }) }

        if (!email) { return res.status(400).send({ status: false, message: "Email is required" }) }
        if (!password) { return res.status(400).send({ status: false, message: "Password is required" }) }

        let userData = await userModel.findOne({ email: email, password: password })
        if (!userData) { return res.status(400).send({ status: false, message: "invalid credentials! pls check it " }) }

        let payload =
        {
            userId: userData['_id'].toString()
            

        }
        let token = JWT.sign({ payload }, "from-group-13",{expiresIn :'24h'})  //expires in 24 hrs
        res.setHeader("x-api-key", token)
        let decodedToken=JWT.verify(token,"from-group-13")
        let iat=decodedToken.iat
        let exp=decodedToken.exp

        

        let obj = {token: token, userId: userData['_id'],  iat:iat , exp:exp}
        res.status(200).send({ status: true, message: "token generated successfully", data: obj })
    }
        
catch (error) {
            res.status(500).send({ status: 'error', message: error.message })
        }

    
}
module.exports ={loginUser,createUser}