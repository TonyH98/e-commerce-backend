const express = require('express')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())




app.get("/", (req , res) => {
    res.send("Welcome to the E-Commerce App")
})


app.get("*", (req , res) => {
    res.status(404).send("Page not found")
})




module.exports = app