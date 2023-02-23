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

const newUser = async (user) => {
    const {password , username} = user

    
    try{

        const salt = await bcrypt.genSalt(saltRounds)
         
        const hashedPassword = await bcrypt.hash(password , salt)

        const newUser = await db.one(
            'INSERT INTO users (username , password) VALUES($1 , $2) RETURNING *',
            [username , hashedPassword]
        );
      
            return newUser
         
    }
    catch(err){
        return err
    }
}


const loginUser = async (user) => {

    const {password , username} = user

    try{
        const oneUser = await db.one(
            "SELECT * FROM users WHERE username=$1",
            username
        )
            if(oneUser){

                //return true or false it will no return user info
                const foundUser = await bcrypt.compare(password, oneUser.password);

                if(foundUser){
                    const {username , id} = oneUser;
                    return {username , id}
                }

            }
    }
    catch(err){
        return err
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
            `SELECT products_id, users_id, product_name, release_date, image, description, price, category, favorites, cart_counter, manufacturer
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




module.exports={getAllUsers , getUser , newUser, loginUser, addnewProductToUser, getAllProductsForUser}