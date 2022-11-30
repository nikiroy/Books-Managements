const {isValidObjectId} = require("mongoose")

const validName=function(name){
    const nameRegex=/^[ a-z ]+$/i

    return nameRegex.test(name)
}

const validTitle=function(title){
    return ["Mr","Mrs","Miss"].indexOf(title)!==-1
}

const isValid=function(value){
     if( typeof value=='undefined' || value==null) return false
     if( typeof value=='string' && value.trim().length===0) return false
     return true
}

const validPhone=function(phone){
    const phoneRegex=/^[789]\d{9}$/
    return phoneRegex.test(phone)
}

const validEmail=function(email){
    const emailRegex=/^[\w-\.]+@([\w-]+\.)+[\w-][a-z]{1,4}$/
    return emailRegex.test(email)
}

const isValidPassword=function(password){
    password = password.trim()
    if (password.length < 8 || password.length > 15) {
        return false
    } return true
}

const isValidPincode=function(pincode){
    const pincoderegex= /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/
    return pincoderegex.test(pincode)
}

const  isValidObjectIds =function(id){
    const check = isValidObjectId(id);
    return check
}

const isValidISBN=function(ISBN){
     const regexISBN =(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/g)
     return regexISBN.test(ISBN)   
}


const isValidDate=function(date){
    const regexDate =/^\d{4}-\d{2}-\d{2}$/
    return regexDate.test(date)
}

const isValidRating=function(rating){
    if(rating<1 || rating>5) 
    return false
    return true
}

module.exports={validName,validTitle,isValid,validPhone,validEmail,isValidPassword,isValidPincode,
    isValidObjectIds,isValidISBN,isValidDate,isValidRating}