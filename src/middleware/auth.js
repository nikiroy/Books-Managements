const JWT =require('jsonwebtoken')
const userModel =require("../models/userModel")

const authentication = async function(req,res,next){
   try{
    let token =req.headers['x-api-key']
    if(!token) {return res.status(400).send({status:false,message:"Token must be present"})}

    JWT.verify(token,"from-group-13",function(error,decodedToken){
        if(error){
            return res.status(401).send({status:false,message:"enter a valid token"})
        }
        else{
            req.token =decodedToken
            next()
        }

    })

}
catch (error){
    res.status(500).send({status:"error",error:error.message})
}
}

module.exports={authentication}