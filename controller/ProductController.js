const express = require("express")

const { getAllProducts , getProduct, deleteProduct } = require('../queries/products')

const product = express.Router()

product.get("/", async (req , res) => {
    const getAllProducts = await getAllProducts()
     if(getAllProducts[0]){
         res.status(200).json(getAllProducts)
     }
     else{
         res.status(500).json({error: "server error"})
     }
 
 })
 
 
 product.get("/:id", async (req , res) => {
     const {id} = req.params
     const product = await getProduct(id);
     if(!product.message){
         res.json(product)
     }
     else{
         res.status(404).json({error: "not found"})
     }
 })
 
 

 
product.delete("/:id", async (req ,res) => {
   const {id} = req.params
   const deletedProducts = await deleteProduct(id)
   if(deletedProducts.id){
     res.status(200).json(deletedProducts)
   }
   else{
     res.status(404).json("Product not found")
   }
 })
 
 
 
 

 
 
 module.exports = product