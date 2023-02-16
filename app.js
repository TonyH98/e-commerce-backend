const express = require('express')

const stripe = require("stripe")(process.env.STRIPE_KEY)
const cors = require('cors')
const app = express()


const products = require("./controller/ProductController")

app.use(cors())

app.use(express.json())


app.use("/products", products)



app.get("/", (req , res) => {
    res.send("Welcome to the E-Commerce App")
})

app.post("/payment", ( req , res ) => {
    const { product , token  } = req.body;
    


    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: product.name,
            shipping: {
                name: token.card.name,
                address: {
                    country: token.card.address_country
                }
            }
        } , {})
    })

})



app.get("*", (req , res) => {
    res.status(404).send("Page not found")
})




module.exports = app