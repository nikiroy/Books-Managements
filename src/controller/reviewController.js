const reviewModel = require("../models/reviewModel")
const bookModel = require('../models/bookModel')
const { isValidObjectIds, isValidRating, isValid, validName } = require('../validation/validation')


const createReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let data = req.body
        let { reviewedBy, rating, review } = data
        if (!isValidObjectIds(bookId)) return res.status(400).send({ status: false, message: "Invalid Book Id" })

        let matchBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!matchBookId) { return res.status(404).send({ status: false, message: "Book not found" }) }

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "No data given for review creation" })

        if (reviewedBy) {
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewed by can't be empty" })
            if (!validName(reviewedBy)) return res.status(400).send({ status: false, message: "Reviwed by can only take alphabets" })
        }
        if (review) {
            if (!isValid(review)) return res.status(400).send({ status: false, message: "Review can't be empty" })
        }

        if (!rating) return res.status(400).send({ status: false, message: "Rating is mandatory" })
        if (typeof rating !== 'number') return res.status(400).send({ status: false, message: "Rating is in wrong format" })
        if (!isValidRating(rating)) return res.status(400).send({ status: false, message: "Rating should be between range(1 to 5)" })

        data.reviewedAt = Date.now()
        data.bookId = bookId

        let createReview = await reviewModel.create(data)

        let updateBookData = await bookModel.findByIdAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new: true })

        let bookObj = {
            _id: createReview._id,
            bookId: bookId,
            reviewedBy: createReview.reviewedBy,
            reviewedAt: createReview.reviewedAt,
            rating: createReview.rating,
            review: createReview.review
        }

        updateBookData._doc.reviewData = bookObj
        return res.status(201).send({ status: true, message: 'Success', data: updateBookData })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


//-------------------------------Update Review----------------------------------------------------//
const updateReview = async function (req, res) {
    try {
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId
        const { review, rating, reviewedBy } = req.body

        if (!isValidObjectIds(bookId)) return res.status(400).send({ status: false, message: "Invalid Book Id" })
        if (!isValidObjectIds(reviewId)) return res.status(400).send({ status: false, message: "Invalid Review Id" })

        if (Object.keys(req.body).length == 0) return res.status(400).send({ status: false, message: "No data given for updation" })

        if (review) {
            if (!isValid(review)) return res.status(400).send({ status: false, message: "Review can't be empty" })
        }
        if (rating) {
            if (typeof rating !== 'number') return res.status(400).send({ status: false, message: "Rating is in wrong format" })
            if (!isValidRating(rating)) return res.status(400).send({ status: false, message: "Rating can be from 1 to 5" })
        }
        if (reviewedBy) {
            if (!isValid(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewed By can't be empty" })
            if (!validName(reviewedBy)) return res.status(400).send({ status: false, message: "Reviewed By can only take alphabets" })
        }

        const findBook = await bookModel.findById({ _id: bookId }).select({ createdAt: 0, updatedAt: 0, _v: 0 })
        if (!findBook || findBook.isDeleted == true) return res.status(404).send({ status: false, message: "Book not found" })
        const findReview = await reviewModel.findById({ _id: reviewId })
        if (!findReview || findReview.isDeleted == true) return res.status(404).send({ status: false, message: "Review not found" })

        if (findReview.bookId.toString() !== bookId) return res.status(400).send({ status: false, message: "Given review id doesn't match with the book" })

        const updatedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { review: review, rating: rating, reviewedBy: reviewedBy } }, { new: true })

        const book = findBook.toObject()
        book['reviewsData'] = updatedReview
        return res.status(400).send({ status: true, message: 'Success', data: book })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//------------------------------------------------Delete Review--------------------------//
const deleteReviewByParam = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if (!isValidObjectIds(bookId)) return res.status(400).send({ status: false, msg: "Enter a valid bookId" })
        if (!isValidObjectIds(reviewId)) return res.status(400).send({ status: false, msg: "Enter a valid reviewId" })

        let book = await bookModel.findById(bookId);
        if (!book || book.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Book not found or book is already deleted" });
        }
        let review = await reviewModel.findById(reviewId);
        if (!review || review.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Review not found" });
        }

        if (review.bookId.toString() !== bookId) return res.status(400).send({ status: false, message: "Given review id doesn't match with the book" })

        let updateBook = await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

        let deletedReview = await reviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { isDeleted: true} });
        res.status(200).send({ status: true, message: "Review deleted sucessfully" })
    }
    catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
}



module.exports = { createReview, updateReview, deleteReviewByParam }