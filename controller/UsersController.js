const express = require("express")

const { getAllUsers 
    , getUser 
    , newUser
    , loginUser
    , addnewProductToUser
    , getAllProductsForUser
    , deleteProductFromUsers
    ,editUser
    , editCartUser
     , addFavoriteToUser
    ,getAllFavoritesForUser
    ,getFavoritebyIndex
    ,editFavoriteUser 
    , deleteFavoriteFromUsers
    , addSearchToUser
    ,getAllSearchForUser
    ,deleteSearchFromUsers
    ,editSearchUser} = require("../queries/users")

const {checkPassword , checkEmail, checkPhoneNumber} = require("../middleware/Middleware")

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

users.post("/signup", checkPassword, checkEmail, checkPhoneNumber, async(req , res) => {

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
       
    
        if(successfulAdd){
            res.json({message: "Product Added"});
        }
        else{
            res.json({error: "Product not added"})
        }
    
    })
    

    users.delete("/:userId/products/:productsId", async (req , res) => {
        const { userId, productsId } = req.params

        const deleteProduct = await deleteProductFromUsers(userId , productsId)

        if(deleteProduct.identification){
            res.status(200).json(deleteProduct)
        }
    })
    
    users.get("/:userId/products", async (req , res) => {
        const {userId} = req.params;
    
        const userProducts = await getAllProductsForUser(userId)
        res.json(userProducts);
    
    })

    users.put("/:id", checkEmail, checkPhoneNumber, async(req , res) => {
        const {id} = req.params

        const editUsers = await editUser(id , req.body)

        res.status(200).json(editUsers)
        console.log(editUsers)
    })

    users.put("/:userId/products/:productsId", async (req ,res) => {
        const { userId, productsId } = req.params
        const updateCart = await editCartUser(userId , productsId, req.body)
        res.status(200).json(updateCart)
        console.log(updateCart)
    })



    users.post("/:userId/favorites/:productsId", async (req , res) => {
        const {userId , productsId} = req.params;
    
        const successfulAdd = await addFavoriteToUser(userId, productsId)
       
    
        if(successfulAdd){
            res.json({message: "Product Added"});
        }
        else{
            res.json({error: "Product not added"})
        }
    
    })


    users.delete("/:userId/favorites/:productsId", async (req , res) => {
        const { userId, productsId } = req.params

        const deleteProduct = await deleteFavoriteFromUsers(userId , productsId)

        if(deleteProduct.identification){
            res.status(200).json(deleteProduct)
        }
    })


    users.get("/:userId/favorites", async (req , res) => {
        const {userId} = req.params;
    
        const userProducts = await getAllFavoritesForUser(userId)
        res.json(userProducts);
    })

    users.get("/:userId/favorites/:productId", async (req, res) => {
        const { userId, productId } = req.params;
    
        try {
            const favorite = await getFavoritebyIndex(userId, productId);
            res.json(favorite);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
    

    users.put("/:userId/favorites/:productsId", async (req ,res) => {
        const { userId, productsId } = req.params
        const updateCart = await editFavoriteUser(userId , productsId, req.body)
        res.status(200).json(updateCart)
        console.log(updateCart)
    })

    


    users.post("/:userId/search/:productsId", async (req , res) => {
        const {userId , productsId} = req.params;
    
        const successfulAdd = await addSearchToUser(userId, productsId)
       
        console.log(successfulAdd)
    
        if(successfulAdd){
            res.json({message: "Product Added"});
        }
        else{
            res.json({error: "Product not added"})
        }
    
    })

    

    users.delete("/:userId/search/:productsId", async (req , res) => {
        const { userId, productsId } = req.params

        const deleteProduct = await deleteSearchFromUsers(userId , productsId)

        console.log(deleteProduct)

        if(deleteProduct.users_id){
            res.status(200).json(deleteProduct)
        }
    })



    // product.get("/", async (req , res) => {
    //     const getAllProduct = await getAllProducts()
        
    //     const filters = req.query;
    //     const filteredProducts = getAllProduct.filter(product => {
    //         let isValid = true;
    //         for (key in filters) {
    //             if (isNaN(filters[key])) {
    //                 isValid = isValid && (product[key].toLowerCase() == filters[key].toLowerCase());
    //             } else {
    //                 isValid = isValid && (product[key] == parseInt(filters[key]));
    //             }
    //         }
    //         return isValid;
    //     });
    //     res.send(filteredProducts);
    //   });



    users.get("/:userId/search", async (req, res) => {
        const { userId } = req.params;
       
        const filters = req.query

        const userProducts = await getAllSearchForUser(userId);

        const filterProducts = userProducts.filter(product => {
            let isValid = true
            for(key in filters){
                if(isNaN(filters[key])){
                    isValid = isValid && (product[key].toLowerCase() = filters[key].toLowerCase())
                }
                else{
                    isValid = isValid && (product[key] == parseInt(filters[key]))
                }
            }
            return isValid
        })
      
        res.json(filterProducts);
      });


    users.put("/:userId/search/:productsId", async (req ,res) => {
        const { userId, productsId } = req.params
        const updateCart = await editSearchUser(userId , productsId, req.body)
        res.status(200).json(updateCart)
        console.log(updateCart)
    })







    module.exports = users