const express = require("express");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const { getAllReviews, getReview, createReview, deleteReview, updateReview } = require('../queries/reviews');

const reviews = express.Router({ mergeParams: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './Images');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: Infinity
  },
});

reviews.get("/", async (req, res) => {
  const { productId } = req.params;

  try {
    const allReviews = await getAllReviews(productId);
    res.json(allReviews);
  } catch (err) {
    res.json(err);
  }
});

reviews.get("/:id", async (req, res) => {
  const { id } = req.params;
  const review = await getReview(id);
  if (!review.message) {
    res.json(review);
  } else {
    res.status(404).json({ error: "not found" });
  }
});

reviews.post("/", upload.single('image'), async (req, res) => {
  try {
    const review = await createReview(req.body);
    res.json(review);
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error });
  }
});

reviews.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deletedReview = await deleteReview(id);
  if (deletedReview.id) {
    res.status(200).json(deletedReview);
  } else {
    res.status(404).json("Review not found");
  }
});

reviews.put("/:id", upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const updatedReviews = await updateReview(id, req.body);
  res.status(200).json(updatedReviews);
});

module.exports = reviews;
