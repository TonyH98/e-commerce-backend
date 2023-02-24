const express = require("express")

const { getAllUsers , getUser , newUser, loginUser, addnewProductToUser, getAllProductsForUser, deleteProductFromUsers} = require("../queries/users")


const users = express.Router({mergeParams: true})

users.get("/", async (req ,res) => {
    const allUsers = await getAllUsers();

    if(allUsers[0]){
        res.status(200).json(allUsers)
    }
    else{
        res.status(500).json({error: "server error"})
    }

})

users.get("/:id", async (req , res) => {
    const {id} = req.params;

    const user = await getUser(id)
    if(user){
        res.json(user)
    }
    else{
        res.status(404).json({error: "User not Found"})
    }

})

users.post("/signup", async(req , res) => {

    const user = await newUser(req.body);
    
    console.log(user)
    
    
    const {id , username} = user
    
    res.status(200).json({username, id});
    
    })
    
    users.post("/login", async (req , res) => {
        const user = await loginUser(req.body)
    
        if(user.username){
            const {id , username} = user
            res.json({message: "Login Successful", id, username});
        }
        else{
            res.json({message: "User Not Found"})
        }
    
    })


    users.post("/:userId/products/:productsId", async (req , res) => {
        const {userId , productsId} = req.params;
    
        const successfulAdd = await addnewProductToUser(userId, productsId)
        console.log(successfulAdd)
    
        if(successfulAdd){
            res.json({message: "Product Added"});
        }
        else{
            res.json({error: "Product not added"})
        }
    
    })
    

    users.delete("/:userId/products/:id", async (req , res) => {
        const { userId, id } = req.params

        const deleteProduct = await deleteProductFromUsers(userId , id)

        if(deleteProduct.identification){
            res.status(200).json(deleteProduct)
        }
    })
    
    users.get("/:userId/products", async (req , res) => {
        const {userId} = req.params;
    
        const userProducts = await getAllProductsForUser(userId)
    
        console.log(userProducts)
        res.json(userProducts);
    
    })




    module.exports = users