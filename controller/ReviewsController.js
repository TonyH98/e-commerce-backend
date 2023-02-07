const express = require("express")

const { getAllReviews, getReview , createReview, deleteReview, updateReview } = require('../queries/reviews')

const reviews = express.Router({mergeParams: true})



reviews.get("/", async (req, res) => {
  const { productId } = req.params;

  try {
    const allReviews = await getAllReviews(productId);
    res.json(allReviews);
  } catch (err) {
    res.json(err);
  }
});


 reviews.get("/:id", async (req , res) => {
    const {id} = req.params
    const review = await getReview(id);
    if(!review.message){
        res.json(review)
    }
    else{
        res.status(404).json({error: "not found"})
    }
})


reviews.post("/",  async (req, res) => {
    try {
      const review = await createReview(req.body);
      res.json(review);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  });

  reviews.delete("/:id", async (req ,res) => {
    const {id} = req.params
    const deletedReview = await deleteReview(id)
    if(deletedReview.id){
      res.status(200).json(deletedReview)
    }
    else{
      res.status(404).json("Review not found")
    }
  })


  reviews.put("/:id", async (req, res) => {
    const { id } = req.params;
    const updatedReviews = await updateReview(id, req.body);
    res.status(200).json(updatedReviews);
  });




module.exports = reviews