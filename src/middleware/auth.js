const JWT = require('jsonwebtoken')
const userModel = require("../models/userModel")
const bookModel = require("../models/bookModel")
const { isValidObjectIds } = require("../validation/validation")


const authentication = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key']
        if (!token) { return res.status(400).send({ status: false, message: "Token must be present" }) }

        JWT.verify(token, "from-group-13", function (error, decodedToken) {
            if(error && error.message=="jwt expired") 
            return res.status(401).send({status:false, message:"Session Expired! Login again"})
            if (error) {
                return res.status(401).send({ status: false, message: "enter a valid token" })
            }
            else {
                req.token = decodedToken
                next()
            }

        })

    }
    catch (error) {
        res.status(500).send({ status: "error", error: error.message })
    }
}
const authorisation = async function (req, res, next) {
    try {
        let bookId = req.params.bookId
        if (bookId) {

            if (!isValidObjectIds(bookId)) return res.status(400).send({ status: false, message: "Invalid Book Id" })
            const matchBookId = await bookModel.findById({ _id: bookId })
            
            if (!matchBookId || matchBookId.isDeleted == true) return res.status(404).send({ status: false, message: "Book Not found" })
            if (matchBookId['userId'].toString() !== req.token.payload.userId) {
                return res.status(403).send({ status: false, message: "Unauthorised user!" })
            }
            return next()

        }
        let data = req.body
        let { userId } = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "No data found from body" })
        if (!isValidObjectIds(userId)) { return res.status(400).send({ status: false, message: "enter a valid user id" }) }
        const matchUserId = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!matchUserId) { return res.status(400).send({ status: false, message: "this userId is not present in databse" }) }
        if (matchUserId['_id'].toString() !== req.token.payload.userId) {
            return res.status(403).send({ status: false, message: "Unauthorized user" })
        }
        next()
    }
    catch (error) {
        res.status(500).send({ status: true, message: error.message })
    }
}

module.exports = { authentication, authorisation }