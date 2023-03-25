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



const createProduct = async (product) => {
    try {
      const newProduct = await db.one(
        "INSERT INTO products (product_name, release_date , image, description, price, category, favorites, quantity, manufacturer) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
        [product.product_name, product.release_date, product.image, product.description, product.price, product.category, product.favorites, product.quantity, product.manufacturer]
      );
      return newProduct;
    } catch (error) {
      return error;
    }
  };



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
      "UPDATE products SET product_name=$1, release_date=$2, image=$3, description=$4, price=$5 , category=$6, manufacturer=$7, favorites=$8,quantity=$9 WHERE id=$10 RETURNING *",
      [product.product_name, product.release_date, product.image, product.description, product.price, product.category, product.manufacturer, product.favorites, product.quantity, id]
    );
    return updatedProduct;
  } catch (error) {
    return error;
  }
};




module.exports = { getAllProducts , getProduct, deleteProduct , updateProducts , createProduct};