const db = require("../db/dbConfig")

const getAllProducts = async () => {
try{
const allProducts = await db.any('SELECT * FROM products')
return allProducts
}
catch(error){
    return error;
}
}



const getProduct = async (id) => {
try{
    const oneProduct = await db.one('SELECT * FROM products WHERE id=$1', id)
    return oneProduct
}
catch(error){
    return error
}
}


// const createProduct = async (bookmark) => {
//     try {
//       const newBookmark = await db.one(
//         "INSERT INTO bookmarks (name, url, category, is_favorite) VALUES($1, $2, $3, $4) RETURNING *",
//         [bookmark.name, bookmark.url, bookmark.category, bookmark.is_favorite]
//       );
//       return newBookmark;
//     } catch (error) {
//       return error;
//     }
//   };



  const deleteProduct = async (id) => {
    try{
        const deletedProduct = await db.one(
            'DELETE FROM products WHERE id = $1 RETURNING *', id
        )
        return deletedProduct
    }
    catch(error){
        return error
    }
}


const updateProducts = async (id, product) => {
  try {
    const updatedProduct = await db.one(
      "UPDATE products SET product_name=$1, release_date=$2, image=$3, description=$4, price=$5 , category=$6, manufacturer=$7, favorites=$8 WHERE id=$9 RETURNING *",
      [product.product_name, product.release_date, product.image, product.description, product.price, product.category, product.manufacturer, product.favorites, id]
    );
    return updatedProduct;
  } catch (error) {
    return error;
  }
};




module.exports = { getAllProducts , getProduct, deleteProduct , updateProducts};