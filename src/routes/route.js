const express = require('express')
const router = express.Router()
const userController=require('../controller/userController')
const bookController=require('../controller/bookController')
const middleware =require("../middleware/auth")

router.post('/register', userController.createUser)

router.post('/login',userController.loginUser)

router.post('/books',middleware.authentication,bookController.createBook)

router.get('/books',middleware.authentication,bookController.getBookData)

router.all('/*',function(req,res){
    res.status(400).send({message:"invalid http request"})
})

module.exports =router;