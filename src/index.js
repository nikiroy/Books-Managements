const express = require("express")
const bodyParser = require("body-parser")
const route = require("./routes/route")
const app = express()

const mongoose = require("mongoose")
app.use(bodyParser.json())


app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb+srv://priyanka912066:Pie5MEDyx8B1zOiq@cluster0.ucnslwp.mongodb.net/Group13Database", { useNewUrlParser: true })
    .then(() => console.log(("Mongoose is connected"))).catch(err => console.log(err.message))

app.use("/", route)

app.listen(process.env.PORT || 3000, function () { console.log("Express is running on port " + (process.env.PORT || 3000)) })




