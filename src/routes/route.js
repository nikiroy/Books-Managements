const express = require('express')
const router = express.Router()
const userController=require('../controller/userController')
const bookController=require('../controller/bookController')
const reviewController=require('../controller/reviewController')
const middleware =require("../middleware/auth")
const awsFile = require("../aws/aws.js")

router.post('/register', userController.createUser)

router.post('/login',userController.loginUser)

router.post('/books',middleware.authentication,middleware.authorisation,bookController.createBook)

router.get('/books',middleware.authentication,bookController.getBookData)

router.get("/books/:bookId",middleware.authentication,bookController.getBookbyId)

router.put("/books/:bookId",middleware.authentication,middleware.authorisation,bookController.updateBookById)

router.delete("/books/:bookId",middleware.authentication,middleware.authorisation,bookController.deleteBookById)

router.post("/books/:bookId/review", reviewController.createReview)
router.put('/books/:bookId/review/:reviewId',reviewController.updateReview)


router.delete("/books/:bookId/review/:reviewId", reviewController.deleteReviewByParam)
router.post('/write-file-aws',awsFile.awsFunction)

router.all('/*',function(req,res){
    res.status(400).send({message:"invalid http request"})
})

module.exports =router;