const db = require("../db/dbConfig")

const bcrypt = require('bcrypt')

const saltRounds = 10

const getAllUsers = async () => {
    try{
        const allUsers = await db.any("SELECT * FROM users")
        return allUsers
    }
    catch(err){
        return err
    }
}

const getUser = async(id) => {
    try{
        const oneUser = await db.one("SELECT * FROM users WHERE id=$1" , id);
        return oneUser
    }
    catch(err){
        return err
    }
}


const checkExistingUser = async (username , email) => {
    try{
        const result = await db.one(
            'SELECT * FROM users WHERE username =$1 OR email = $2',
            [username , email]
        )
        return result.rowCount > 0
    }
    catch(err){
        console.error(err)
    }
}

const newUser = async (user) => {
    const {password , username, firstName, lastName, email,  phoneNumber} = user

    
    try{
        const userExist = await checkExistingUser(username , email)
        if(userExist){
            throw new Error('Username or email already exists')
        }
        const salt = await bcrypt.genSalt(saltRounds)
         
        const hashedPassword = await bcrypt.hash(password , salt)

        const newUser = await db.one(
            'INSERT INTO users (username, password, firstName, lastName, email, phoneNumber) VALUES($1 , $2, $3, $4, $5, $6) RETURNING *',
            [username , hashedPassword, firstName, lastName, email, phoneNumber]
        );
            return newUser
    }
    catch(err){
        return err
    }
}


const loginUser = async (user) => {

    const {password , username} = user

    try {
        const oneUser = await db.one(
            "SELECT * FROM users WHERE username=$1",
            username
        );
        
        // Check if the user's information exists in the database and if the provided password matches the one stored in the database.
        if (oneUser && await bcrypt.compare(password, oneUser.password)) {
            const {username , id} = oneUser;
            return {username , id};
        } else {
            // If the provided credentials are incorrect, throw an error to prevent the user from logging in.
            throw new Error("Invalid username or password.");
        }
    }
    catch (err) {
        // Catch any errors thrown and return an error message.
        return err.message;
    }

}


const addnewProductToUser = async (userId, productsId) =>{
    try{
        const add = await db.none(
            'INSERT INTO users_products (users_id, products_id) VALUES($1, $2)',
            [userId , productsId]
        );
        return !add;
    }
    catch (err){
        return err
    }
}

const getAllProductsForUser = async (id) => {

    try{
        const productsByUser = await db.any(
            `SELECT identification, products_id, users_id, product_name, release_date, image, description, price, category, favorites, cart_counter, manufacturer
            FROM users_products
            JOIN users
            ON users.id = users_products.users_id
            JOIN products
            ON products.id = users_products.products_id
            WHERE users_products.users_id = $1`,
            id
        );
        return productsByUser
    }
    catch(error){
        return error
    }
    }

const deleteProductFromUsers = async (userId , productId) => {
    try{
        const deleteProduct = await db.one(
            'DELETE FROM users_products WHERE users_id = $1 AND products_id = $2 RETURNING *', 
            [userId, productId]
        )
        return deleteProduct
    }
    catch(error){
        return error
    }
}

const editCartUser = async (userId, productId, product) => {
    try {
      const updateCart = await db.one(
        `
          UPDATE products p
          SET 
            product_name=$1, 
            release_date=$2, 
            image=$3,
            description=$4, 
            price=$5, 
            category=$6,
            manufacturer=$7, 
            favorites=$8,
            cart_counter=$9
          FROM users_products up
          WHERE p.id = up.products_id 
            AND up.users_id=$10
            AND up.products_id = $11
          RETURNING *
        `,
        [
          product.product_name,
          product.release_date,
          product.image,
          product.description,
          product.price,
          product.category,
          product.manufacturer,
          product.favorites,
          product.cart_counter,
          userId,
          productId,
        ]
      );
      return updateCart;
    } catch (err) {
      return err;
    }
  };
 
module.exports={
  getAllUsers
 ,getUser
 ,newUser
 ,loginUser
 ,addnewProductToUser
 ,getAllProductsForUser
 ,deleteProductFromUsers
 ,editCartUser}