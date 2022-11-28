const bookModel = require('..models/bookModel')
const userModel =require('models/userModel')
const ObjectId =require('mongoose').Types.ObjectId
    
//------------------------create book data----------------------//

const {validName,isValid,isValidObjectIds,isValidISBN,isValidDate}=require('../validator/validation')

const createBook=async function(req,res){
    try{ 
    const data=req.body
    const {title, excerpt, userId, ISBN, category, subcategory, releasedAt}=data

    if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"No data given for creation"})
    if(!title) return res.status(400).send({status:false,message:"Title is mandatory"})
    if(!isValid(title)) return res.status(400).send({status:false,message:"Title can't be empty"})

    if(!excerpt) return res.status(400).send({status:false,message:"Excerpt is mandatory"})
    if(!isValid(excerpt)) return res.status(400).send({status:false,message:"Excerpt can't be empty"})

    if(!userId) return res.status(400).send({status:false,message:"User Id is mandatory"})
    if(!isValid(userId)) return res.status(400).send({status:false,message:"User Id can't be empty"})
    if(!isValidObjectIds(userId)) return res.status(400).send({status:false, message:"Invalid UserId"})

    if(userId!==req.token.userId) return res.status(403).send({status:false,message:"Unauthorized User"})

    if(!ISBN) return res.status(400).send({status:false,message:"ISBN is mandatory"})
    if(!isValid(ISBN)) return res.status(400).send({status:false,message:"ISBN can't be empty"})
    if(!isValidISBN(ISBN)) return res.status(400).send({status:false,message:"Invalid ISBN"})

    if(!category) return res.status(400).send({status:false,message:"Category is mandatory"})
    if(!isValid(category)) return res.status(400).send({status:false,message:"Category can't be empty"})
    if(!validName(category)) return res.status(400).send({status:false,message:"Category can only take alphabets"})
    

    if(!subcategory) return res.status(400).send({status:false,message:"Sub Category is mandatory"})
    if(!validName(subcategory)) return res.status(400).send({status:false,message:"Sub Category can only take alphabets"})

    if(!releasedAt) return res.status(400).send({status:false,message:"releasedAt is mandatory"})
    if(!isValid(releasedAt)) return res.status(400).send({status:false,message:"releasedAt can't be empty"})
    
    if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "releasedAt should be in (YYYY-MM-DD) format" })
    
    const checkBook1=await bookModel.findOne({title:title})
    if(checkBook1) return res.status(400).send({status:false, message:"Title already exists"})   
    
    const checkBook2=await bookModel.findOne({ISBN:ISBN})
    if(checkBook2) return res.status(400).send({status:false, message:"ISBN already exists"})

    const bookCreated=await bookModel.create(data)
    return res.status(201).send({status:true,message:"Success", data:bookCreated})
}
catch(err){
    return res.status(500).send({status:false, message:err.message})
}
}


//-------------------------get book data-----------------------------------//
   
const getBookData = async function(req,res){
    try{
        let query =req.query
        let{userId,category,subcategory} =query
        if (Object.keys(req.query).length == 0) { return res.status(400).send({ status: false, msg: "empty req" }) }
        
        
        
            if(!userId) return res.status(400).send({status:false,message:"userId is required"})
            if(!ObjectId.isValid(userId)) {return res.status(400).send({status:false,message:"invalid userId"})}
            let checkUserID =await userModel.findById(userId)
            if(!checkUserID){return res.status(400).send({status:false,message:"Invalid userID"})}
            if(!category) return res.status(400).send({status:false,message:"category is required"})   
            if(!subcategory) return res.status(400).send({status:false,message:"sub category is required"})
            
            
        let createBook =await bookModel.create(data)
        return res.status(201).send({status:true,data:createBook})        


    }
catch (error) {
    res.status(500).send({status:'error',error:error.message})
}

}
module.exports={createBook,getBookData}

