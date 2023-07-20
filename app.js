const express = require('express')
require("dotenv").config()

const stripe = require("stripe")(process.env.REACT_API_STRIPE_KEY)
const cors = require('cors')
const app = express()

const products = require("./controller/ProductController")
const user = require("./controller/UsersController")



app.use(cors())
app.use(express.json())
app.use(express.static('public'))




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

  const lineItems = items.map((item) => {

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
    cancel_url: "https://digital-commerce-site.netlify.app/"
  });

  res.status(200).send(JSON.stringify({
    url: session.url
  }))
  
  
});




app.get("*", (req , res) => {
    res.status(404).send("Page not found")
})

module.exports = app
