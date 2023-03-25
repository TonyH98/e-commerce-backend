const express = require('express')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const cors = require('cors')
const app = express()

const products = require("./controller/ProductController")
const user = require("./controller/UsersController")

app.use(cors())
app.use(express.json())

app.use("/products", products)
app.use("/users", user)

app.get("/", (req , res) => {
    res.send("Welcome to the E-Commerce App")
})

const isAuthenticated = (req , res , next) => {
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/users')
}

app.post('/logout', isAuthenticated, (req , res) => {
    req.session.destroy((err) => {
        if(err){
            console.log(err)
        }
        res.redirect('/users')
    })
})

app.post("/payment", async (req , res) => {
    const { product , token , user } = req.body;

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
            description: `Customer for ${user.email}`,
            metadata: {
                name: user.name,
                phone: user.phone,
                address: {
                    line1: user.address.line1,
                    line2: user.address.line2,
                    city: user.address.city,
                    state: user.address.state,
                    postal_code: user.address.postal_code,
                    country: user.address.country
                }
            }
        });
        const charge = await stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: product.name,
            shipping: {
                name: token.card.name,
                address: {
                    line1: user.address.line1,
                    line2: user.address.line2,
                    city: user.address.city,
                    state: user.address.state,
                    postal_code: user.address.postal_code,
                    country: user.address.country
                }
            }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get("*", (req , res) => {
    res.status(404).send("Page not found")
})

module.exports = app
