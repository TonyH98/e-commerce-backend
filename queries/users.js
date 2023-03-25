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
    const {password , username, firstname, lastname, email,  phonenumber} = user

    
    try{
        const userExist = await checkExistingUser(username , email)
        if(userExist){
            throw new Error('Username or email already exists')
        }
        const salt = await bcrypt.genSalt(saltRounds)
         
        const hashedPassword = await bcrypt.hash(password , salt)

        const newUser = await db.one(
            'INSERT INTO users (username, password, firstname, lastname, email, phonenumber) VALUES($1 , $2, $3, $4, $5, $6) RETURNING *',
            [username , hashedPassword, firstname, lastname, email, phonenumber]
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
            `SELECT identification, products_id, users_id, product_name, release_date, image, description, price, category, favorites, quantity, manufacturer
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


const editUser = async (id , user) => {
    try{
        const editUser = await db.one(
            'UPDATE users SET username=$1, firstname=$2, lastname=$3, email=$4, phonenumber=$5 WHERE id=$6 RETURNING *',
            [user.username, user.firstname, user.lastname, user.email, user.phonenumber, id]
        )
        return editUser
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
            quantity=$9
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
          product.quantity,
          userId,
          productId,
        ]
      );
      return updateCart;
    } catch (err) {
      return err;
    }
  };


  const addFavoriteToUser = async (userId, productsId) =>{
    try{
        const add = await db.none(
            'INSERT INTO users_favorite (users_id, products_id) VALUES($1, $2)',
            [userId , productsId]
        );
        return !add;
    }
    catch (err){
        return err
    }
}


const getAllFavoritesForUser = async (id) => {

    try{
        const favoritesByUser = await db.any(
            `SELECT 
            products_id, users_id, 
            product_name, 
            image, price,
            favorites
            FROM users_favorite
            JOIN users
            ON users.id = users_favorite.users_id
            JOIN products
            ON products.id = users_favorite.products_id
            WHERE users_favorite.users_id = $1`,
            id
        );
        return favoritesByUser
    }
    catch(error){
        return error
    }
    }


    const deleteFavoriteFromUsers = async (userId , productId) => {
        try{
            const deleteProduct = await db.one(
                'DELETE FROM users_favorite WHERE users_id = $1 AND products_id = $2 RETURNING *', 
                [userId, productId]
            )
            return deleteProduct
        }
        catch(error){
            return error
        }
    }


    const editFavoriteUser = async (userId, productId, product) => {
        try {
          const updateFavorite = await db.one(
            `
              UPDATE products p
              SET 
                product_name=$1,
                image=$2,
                price=$3,
                favorites=$4
              FROM users_favorite up
              WHERE p.id = up.products_id 
                AND up.users_id=$5
                AND up.products_id = $6
              RETURNING *
            `,
            [
              product.product_name,
              product.image,
              product.price,
              product.favorites,
              userId,
              productId,
            ]
          );
          return updateFavorite;
        } catch (err) {
          return err;
        }
      };








      const addSearchToUser = async (userId, productsId, selected = false) => {
        try {
            const currentDate = new Date().toLocaleDateString('en-US', { 
                month: '2-digit', 
                day: '2-digit', 
                year: 'numeric' 
            }).split('/').join('/');
            
            const add = await db.none(
                'INSERT INTO users_search(created, selected, users_id, products_id) VALUES($1, $2, $3, $4)',
                [currentDate, selected, userId, productsId]
            );
            
            return !add;
        } catch (err) {
            return err;
        }
    };
    
    
    
    const getAllSearchForUser = async (id) => {
    
        try{
            const favoritesByUser = await db.any(
                `SELECT 
                products_id, users_id, 
                product_name, 
                image, price,
                favorites,
                created,
                selected
                FROM users_search
                JOIN users
                ON users.id = users_search.users_id
                JOIN products
                ON products.id = users_search.products_id
                WHERE users_search.users_id = $1`,
                id
            );
            return favoritesByUser
        }
        catch(error){
            return error
        }
        }
    
    
        const deleteSearchFromUsers = async (userId , productId) => {
            try{
                const deleteProduct = await db.one(
                    'DELETE FROM users_search WHERE users_id = $1 AND products_id = $2 RETURNING *', 
                    [userId, productId]
                )
                return deleteProduct
            }
            catch(error){
                return error
            }
        }
    
    
        const editSearchUser = async (userId, productId, product) => {
            try {
              const updateFavorite = await db.one(
                `
                  UPDATE products p
                  SET 
                    product_name=$1,
                    image=$2,
                    price=$3,
                    favorites=$4
                  FROM users_search up
                  WHERE p.id = up.products_id 
                    AND up.users_id=$5
                    AND up.products_id = $6
                  RETURNING *
                `,
                [
                  product.product_name,
                  product.image,
                  product.price,
                  product.favorites,
                  userId,
                  productId,
                ]
              );
              return updateFavorite;
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
 , editUser
 ,editCartUser
,addFavoriteToUser
,getAllFavoritesForUser
,editFavoriteUser
,deleteFavoriteFromUsers
,editSearchUser
,deleteSearchFromUsers
,addSearchToUser
,getAllSearchForUser}