const db = require("../db/dbConfig")

const getAllProducts = async () => {
  try {
      const allProducts = await db.any(`
          SELECT products.*,
          json_agg(json_build_object('id', products_image.id, 'image', products_image.image)) AS image
          FROM products
          LEFT JOIN products_image ON products.id = products_image.product_id
          GROUP BY products.id
      `);
      return allProducts;
  } catch (error) {
      return error;
  }
};





const getProduct = async (id) => {
  try {
      const oneProduct = await db.one(`
          SELECT products.*, 
          json_agg(json_build_object('id', products_image.id, 'image', products_image.image)) AS images
          FROM products 
          LEFT JOIN products_image ON products.id = products_image.product_id
          WHERE products.id = $1
          GROUP BY products.id
      `, id);
      return oneProduct;
  } catch (error) {
      return error;
  }
};




const createProduct = async (product) => {
    try {
      const newProduct = await db.one(
        "INSERT INTO products (product_name, price_id, release_date ,  description, price, category,manufacturer) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [product.product_name, product.price_id, product.release_date, product.description, product.price, product.category, product.manufacturer]
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
      "UPDATE products SET product_name=$1, release_date=$2, image=$3, description=$4, price=$5 , category=$6, manufacturer=$7, price_id=$8 WHERE id=$9 RETURNING *",
      [product.product_name, product.release_date, product.image, product.description, product.price, product.category, product.manufacturer, product.price_id, id]
    );
    return updatedProduct;
  } catch (error) {
    return error;
  }
};




module.exports = { getAllProducts , getProduct, deleteProduct , updateProducts , createProduct};