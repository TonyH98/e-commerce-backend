const express = require("express")

const { getAllProducts , getProduct, deleteProduct, updateProducts, createProduct } = require('../queries/products')

const reviews = require("./ReviewsController")


const product = express.Router()

product.use("/:productId/reviews", reviews)


product.get("/", async (req , res) => {
  const getAllProduct = await getAllProducts()
  
  const filters = req.query;
  const filteredProducts = getAllProduct.filter(product => {
      let isValid = true;
      for (key in filters) {
          if (isNaN(filters[key])) {
              isValid = isValid && (product[key].toLowerCase() == filters[key].toLowerCase());
          } else {
              isValid = isValid && (product[key] == parseInt(filters[key]));
          }
      }
      return isValid;
  });
  res.send(filteredProducts);
});




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
 
 
 product.post("/",  async (req, res) => {
    try {
      const product = await createProduct(req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  });
 
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

product.put("/:id",  async (req, res) => {
    const { id } = req.params;
    const updatedProduct = await updateProducts(id, req.body);
    res.status(200).json(updatedProduct);
  });
 
 
 
 
 module.exports = product


