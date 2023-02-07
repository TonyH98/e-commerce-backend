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


// const updateBookmark = async (id, bookmark) => {
//   try {
//     const updatedBookmark = await db.one(
//       "UPDATE bookmarks SET name=$1, url=$2, category=$3, is_favorite=$4 where id=$5 RETURNING *",
//       [bookmark.name, bookmark.url, bookmark.category, bookmark.is_favorite, id]
//     );
//     return updatedBookmark;
//   } catch (error) {
//     return error;
//   }
// };




module.exports = { getAllProducts , getProduct, deleteProduct};