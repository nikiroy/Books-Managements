const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel =require("../models/reviewModel")

//------------------------create book data----------------------//

const { validName, isValid, isValidObjectIds, isValidISBN, isValidDate } = require('../validation/validation')

const createBook = async function (req, res) {
    try {
        const data = req.body
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "No data given for creation" })
        if (!title) return res.status(400).send({ status: false, message: "Title is mandatory" })
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title can't be empty" })

        if (!excerpt) return res.status(400).send({ status: false, message: "Excerpt is mandatory" })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, message: "Excerpt can't be empty" })

        if (!userId) return res.status(400).send({ status: false, message: "User Id is mandatory" })
        if (!isValid(userId)) return res.status(400).send({ status: false, message: "User Id can't be empty" })
        if (!isValidObjectIds(userId)) return res.status(400).send({ status: false, message: "Invalid UserId" })
        if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is mandatory" })
        if (!isValid(ISBN)) return res.status(400).send({ status: false, message: "ISBN can't be empty" })
        if (!isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "Invalid ISBN" })

        if (!category) return res.status(400).send({ status: false, message: "Category is mandatory" })
        if (!isValid(category)) return res.status(400).send({ status: false, message: "Category can't be empty" })
        if (!validName(category)) return res.status(400).send({ status: false, message: "Category can only take alphabets" })


        if (!subcategory) return res.status(400).send({ status: false, message: "Sub Category is mandatory" })
        if (!validName(subcategory)) return res.status(400).send({ status: false, message: "Sub Category can only take alphabets" })

        if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt is mandatory" })
        if (!isValid(releasedAt)) return res.status(400).send({ status: false, message: "releasedAt can't be empty" })

        if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "releasedAt should be in (YYYY-MM-DD) format" })

        const checkBook1 = await bookModel.findOne({ title: title })
        if (checkBook1) return res.status(400).send({ status: false, message: "Title should be unique" })

        const checkBook2 = await bookModel.findOne({ ISBN: ISBN })
        if (checkBook2) return res.status(400).send({ status: false, message: "ISBN already exists" })

        const bookCreated = await bookModel.create(data)
        return res.status(201).send({ status: true, message: "Success", data: bookCreated })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


//-------------------------get book data-----------------------------------//

const getBookData = async function (req, res) {
    try {
        const { userId, category, subcategory } = req.query
        if (!userId && !category && !subcategory) {
            const getAllBooks = await bookModel.find({ isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })
     
            const sortBook = getAllBooks.sort((a, b) => a.title.localeCompare(b.title))
            return res.status(200).send({ status: true, message: "success", data: sortBook })
        }
        if (userId) {
            if (!isValidObjectIds(userId)) {
                return res.status(400).send({ status: false, message: "Enter Valid User Id" })
            }
        }
        const book = await bookModel.find({ $or: [{ userId: userId }, { category: category }, { subcategory: subcategory }], isDeleted: false }).select({ title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 })
        console.log(book)
        if (book.length == 0) {
            return res.status(400).send({ status: false, message: 'Books not found' })
        }

        else {
            const sortBook = book.sort((a, b) => a.title.localeCompare(b.title))
            res.status(200).send({ status: true, message: "success", data: sortBook })
        }
    }
    catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }

}

//----------------------------get book by Id--------------------------------//
const getBookbyId = async function (req, res) {
    try {
        let bookId = req.params.bookId;
        if (!isValidObjectIds(bookId)) 
            return res.status(400).send({ status: false, messsge: "Invalid Book Id" })

        const Book = await bookModel.findById({ _id: bookId }).select({ deletedAt: 0, __v: 0 })

        if (!Book || Book.isDeleted==true) {
            return res.status(404).send({ status: false, message: "Book not Found" })
        }

        let reviewsData = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({
            _id: 1, bookId: 1, reviewedBy: 1, reviewedAt: 1, rating: 1, review: 1
        })

        const books = Book.toObject()
        books['reviewsData'] = [...reviewsData]
        return res.status(200).send({ status: true, message: 'Books list', data: books })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: err.message })
    }
} 
//---------------------------Update bookData----------------------------------//
const updateBookById=async function(req,res){
    try{
        const data=req.body
        const bookId=req.params.bookId
        const {title, excerpt,releasedAt,ISBN}=data
        if(!isValidObjectIds(bookId)) return res.status(400).send({status:false, message:"Invalid Book Id"})

        const findBook=await bookModel.findById(bookId)
        if(!findBook || findBook.isDeleted==true) return res.status(404).send({status:false, message:"Book Not found or data is deleted"})

        if(Object.keys(data).length==0) return res.status(400).send({status:false, message:"No data given for updation"})

        if(title){
            if(!isValid(title)) return res.status(400).send({status:false, message:"Title is in wrong format"})
            const checkTitle=await bookModel.findOne({title})
            if(checkTitle) return res.status(400).send({status:false,message:"Title of book is already used"})
        }
        if(excerpt){
            if(!isValid(excerpt)) return res.status(400).send({status:false, message:"Excerpt can't be empty"})
        }
        if(ISBN){
                                                                                                                                                                                                                        if(!isValid(ISBN) || !isValidISBN(ISBN)) return res.status(400).send({status:false,message:"Invalid ISBN"})
            const checkISBN=await bookModel.findOne({ISBN})
            if(checkISBN) return res.status(400).send({status:false, message:"ISBN is already registered"})
        }
        if(releasedAt){
            if(!isValid(releasedAt) || !isValidDate(releasedAt)) return res.status(400).send({status:false , message:"releasedAt is in wrong format"})
        }
        const updatedBook=await bookModel.findOneAndUpdate({_id:bookId}, {$set :{title, excerpt,releasedAt,ISBN}},{new:true})
        return res.status(200).send({status:true,message:"Success", data:updatedBook})
    }
    catch(err){
        return res.status(500).send({status:false, message:err.message})
    }
}


//---------------------------deleteBooks------------------------------------------//
const deleteBookById = async function (req, res) {
    try {
        const booksId = req.params.bookId

        let book = await bookModel.findOne({ _id: booksId, isDeleted: false })
        if (book) {
            const deleteBook = await bookModel.findOneAndUpdate({ _id: booksId }, { isDeleted: true, deletedAt: new Date() })
            return res.status(200).send({ status: true, message: "Book deleted successfully" })
        }
        else {
            return res.status(404).send({ status: false, message: "Book already Deleted or not found" })
        }

    }
    catch (err) {
       return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createBook, getBookData, deleteBookById,getBookbyId,updateBookById }


