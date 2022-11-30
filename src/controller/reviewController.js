const reviewModel =require("../models/reviewModel")
const bookModel = require('../models/bookModel')
const {isValidObjectIds, isValidRating, isValid, validName}=require('../validation/validation')
const createReview = async function(req,res){
    try{
        let bookId =req.params.bookId
        let data=req.body
        let{review,rating,reviewBy}=data
        if (!isValidObjectIds(bookId)) return res.status(400).send({ status: false, message: "Invalid Book Id" })
        if(Object.keys(data)==0) return res.status(400).send({status:false, message:"No data given for review creation"})
        let matchBookId = await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!matchBookId) {return res.status(400).send({status:false,message:"book with this id is not available in our database"})}
        if(!isValidRating(rating)) return res.status(400).send({status:false, message:"Please enter valid rating in between range(1 to 5)"})
        if(!validName(name)) return res.status(400).send({status:false, message:"Please provide the valid name in reviewedBy"})

        if(!validName(name)) return res.status(400).send({status:false, message:"Please provide valid review"})

      
        if(!rating) {return res.status(400).send({status:false,message:"Please enter Book rating"})}
        data.reviewedAt = Date.now()

     
        let createReview = await reviewModel.create(data)

     
        let updateBookData = await bookModel.findByIdAndUpdate({ _id: BookId }, { $inc: { reviews: 1 } }, { new: true })

        let bookObj = {
            _id: createReview._id,
            bookId: BookId,
            reviewedBy: createReview.reviewedBy,
            reviewedAt: createReview.reviewedAt,
            rating: createReview.rating,
            review: createReview.review
        }

    updateBookData._doc.reviewData = bookObj
res.status(201).send({status:true,message:"Success",data:UpdatedBookData})
    }
    catch(error){
        res.status(500).send({status:false,message:error.message})
    }
}
//-------------------------------Update Review----------------------------------------------------//
 const updateReview=async function(req,res){
    try{
        const bookId=req.params.bookId
        const reviewId=req.params.reviewId
        const {review, rating, reviewedBy}=req.body

        if(!isValidObjectIds(bookId)) return res.status(400).send({status:false, message:"Invalid Book Id"})
        if(!isValidObjectIds(reviewId)) return res.status(400).send({status:false, message:"Invalid Review Id"})

        if(Object.keys(req.body).length==0) return res.status(400).send({status:false, message:"No data given for updation"})
        
        if(review){
            if(!isValid(review)) return res.status(400).send({status:false, message:"Review can't be empty"})
        }
        if(rating){
            if(typeof rating!=='number') return res.status(400).send({status:false, message:"Rating is in wrong format"})
            if(!isValidRating(rating)) return res.status(400).send({status:false, message:"Rating can be from 1 to 5"})
        }
        if(reviewedBy){
            if(!isValid(reviewedBy)) return res.status(400).send({status:false, message:"Reviewed By can't be empty"})
            if(!validName(reviewedBy)) return res.status(400).send({status:false, message:"Reviewed By can only take alphabets"})
        }

        const findBook=await bookModel.findById({_id:bookId}).select({createdAt:0,updatedAt:0,_v:0})
        if(!findBook || findBook.isDeleted==true) return res.status(404).send({status:false, message:"Book not found"})
        const findReview=await reviewModel.findById({_id:reviewId})
        if(!findReview || findReview.isDeleted==true) return res.status(404).send({status:false, message:"Review not found"})

        if(findReview.bookId!==bookId) return res.status(400).send({status:false, message:"No review found for this book"})

        const updatedReview=await reviewModel.findOneAndUpdate({_id:reviewId},{$set: {review:review, rating:rating, reviewedBy:reviewedBy}}, {new:true})

        const book = findBook.toObject()
        book['reviewsData']=updatedReview
        return res.status(400).send({status:true, message:'Success', data:book})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}


//------------------------------------------------Delete Review--------------------------//
const deleteReviewByParam = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if(!bookId) return res.status(400).send({error:"bookId must be present"})
        if(!reviewId) return res.status(400).send({error:"reviewId must be present"})

        if(!Validation.isValid(bookId)) res.status(400).send({status:false,error:"bookId is not valid"})
        if(!Validation.isValid(reviewId)) res.status(400).send({status:false,error:"reviewId is not valid"})

        if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: "Enter a valid bookId" })
        if (!isValidObjectId(reviewId)) return res.status(400).send({ status: false, msg: "Enter a valid reviewId" })

        let book = await bookModel.findById(bookId);
        if (!book) {
          return res.status(404).send({status:false, message:" "});
        }
        let review = await reviewModel.findById(reviewId);
        if (!review) {
          return res.status(404).send({status:false, message:" "});
        }

        if(book.isDeleted){
            return res.status(200).send({status:false, message:"Already deleted"})
        }
        if(review.isDeleted){
            return res.status(200).send({status:false, message:"Already deleted"})
        }

        let updateBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } }, { new: true })

        let deletedReview = await reviewModel.updateOne({ _id: reviewId }, { $set: { isDeleted: true, deletedAt: new Date() } });
        res.status(200).send({ status: true, data: updateBook, message: "review deleted sucessfully" })
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}



module.exports = { createReview,updateReview,deleteReviewByParam}