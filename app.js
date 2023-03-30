const express = require('express')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const cors = require('cors')
const app = express()

const products = require("./controller/ProductController")
const user = require("./controller/UsersController")

app.use(cors())
app.use(express.json())
app.use(express.static('public'))

const PORT = process.env.PORT


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


app.post('/create-checkout-session', async (req, res) => {
    const items = req.body.items; // assume that items is an array of objects containing product_id and quantity
  
    // fetch the price for each item from Stripe API
    const lineItems = await Promise.all(
      items.map(async (item) => {
        const price = await stripe.prices.retrieve(item.product_id);
        return {
          price: price.id,
          quantity: item.quantity,
        };
      })
    );
  
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${PORT}?success=true`,
      cancel_url: `${PORT}?canceled=true`,
    });
  
    res.json({ id: session.id });
  });
  



app.get("*", (req , res) => {
    res.status(404).send("Page not found")
})

module.exports = app
