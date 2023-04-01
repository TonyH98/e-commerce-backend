const express = require('express')
const stripe = require("stripe")("sk_test_51McALmHgd5U2y6vdLJiKvnZq8wWKDvkf3LocRNeV3zVlUwUT0qu9DjPcMtVBIPymxhfvNTQTdbWtdl8ChFKC4oD500pYsmEHeG")
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
  const { items } = req.body;
  console.log("Request body:", req.body);
  // Map the items array to create an array of line items for the Stripe checkout session
  const lineItems = items.map((item) => {
    // Check if item.price is a valid number
    const unitAmount = Math.round(parseFloat(item.price) * 100);
    
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_name,
          images: [item.image],
        },
        unit_amount_decimal: unitAmount
      },
      quantity: item.quantity,
    };
  });
  
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel"
  });

  res.status(200).send(JSON.stringify({
    url: session.url
  }))
  
  
});




app.get("*", (req , res) => {
    res.status(404).send("Page not found")
})

module.exports = app
