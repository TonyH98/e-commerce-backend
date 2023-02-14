const express = require('express')
const cors = require('cors')
const app = express()

const products = require("./controller/ProductController")

app.use(cors())

app.use(express.json())


app.use("/products", products)

// app.use("/products", (req , res , next) => {
//     const filters = req.query;

//     const filterProduct = products.filter(product => {
//         let valid = true
//         for(key in filters){
//             valid = valid && product[key] == filters[key]
//         }
//         return valid
//     })

//     res.send(filterProduct)
// })



app.get("/", (req , res) => {
    res.send("Welcome to the E-Commerce App")
})


app.get("*", (req , res) => {
    res.status(404).send("Page not found")
})




module.exports = app