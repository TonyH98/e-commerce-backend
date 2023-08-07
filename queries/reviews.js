const db = require("../db/dbConfig")


const getAllReviews = async (product_id) => {
    try {
    const allReviews = await db.any(
    "SELECT * FROM reviews WHERE product_id=$1",
    product_id
    );
    return allReviews;
    } catch (err) {
    return err;
    }
}
    


const getReview = async (id) => {
    try{
        const oneReview = await db.one("SELECT * FROM reviews WHERE id=$1", id)
            return oneReview
        }
        catch(error){
            return error
        }
    }

const createReview = async (review) => {
    try{
        const newReview = await db.one(
            'INSERT INTO reviews (reviewer, title, content, rating, image, product_id, user_id) VALUES ($1 , $2, $3, $4, $5, $6, $7) RETURNING *',
            [review.reviewer, review.title, review.content, review.rating, review.image, review.product_id, review.user_id]
        )
        return newReview
    }
    catch(error){
        console.log(error)
        return error
    }
}

const deleteReview = async (id) => {
    try{
        const deletedReview = await db.one(
            'DELETE FROM reviews WHERE id = $1 RETURNING *', id
        )
        return deletedReview
    }
    catch(error){
        return error
    }
}


const updateReview = async (id, review) => {
    try {
      const updatedReview = await db.one(
        "UPDATE reviews SET reviewer=$1, title=$2, content=$3, rating=$4, image=$5, product_id=$6, user_id=$7 WHERE id=$8 RETURNING *",
        [review.reviewer, review.title, review.content, review.rating, review.image, review.product_id, review.user_id, id]
      );
      return updatedReview;
    } catch (error) {
      return error;
    }
  };





module.exports={    getAllReviews, getReview , createReview, deleteReview, updateReview   }