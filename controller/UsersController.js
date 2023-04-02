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
    ,editSearchUser
    ,getProductByIndex
    ,addPurchaseToUser
    ,getAllPurchaseForUser
    ,deletePurchasesFromUsers,
    getPurchasebyIndex} = require("../queries/users")

const {checkPassword , checkEmail, checkPhoneNumber} = require("../middleware/Middleware")


const users = express.Router({mergeParams: true})




users.get("/", async (req ,res) => {
    const allUsers = await getAllUsers();

    const filter = req.query
    const filterUser = allUsers.filter(user => {
        let isValid = true
        for(key in filter){
            if(isNaN(filter[key])){
                isValid = isValid && (user[key].toLowerCase() == filter[key].toLowerCase())
            }
            else{
                isValid = isValid && (user[key] == parseInt(filter[key]))
            }
        }
        return isValid
    })
    res.send(filterUser)

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
            res.status(200).json({message: "Login Successful", id, username});
        }
        else{
            res.status(401).json({message: "User Not Found"})
        }
    
    })


    users.post("/:userId/products/:productsId", async (req , res) => {
        const {userId , productsId} = req.params;
        const { quantity } = req.body;
          
        const successfulAdd = await addnewProductToUser(userId, productsId, quantity)
          
        if(successfulAdd){
          res.json({message: "Product Added"});
        } else {
          res.json({error: "Product not added"})
        }
      });
    

    users.delete("/:userId/products/:productsId", async (req , res) => {
        const { userId, productsId } = req.params

        const deleteProduct = await deleteProductFromUsers(userId , productsId)

        console.log(deleteProduct)

        if(deleteProduct){
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

    users.put("/:userId/products/:productsId", async (req, res) => {
        const { userId, productsId } = req.params;
        const { quantity } = req.body;
        const updateCart = await editCartUser(userId, productsId, { quantity });
        res.status(200).json(updateCart);
      });



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

        if(deleteProduct){
            res.status(200).json(deleteProduct)
        }
    })



    users.get("/:userId/favorites", async (req , res) => {
        const {userId} = req.params;
        
        const filters = req.query

        const userProducts = await getAllFavoritesForUser(userId)
        
        const filterFav = userProducts.filter(product => {
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

        res.json(filterFav)
    })

    users.get("/:userId/favorites/:productId", async (req, res) => {
        const { userId, productId } = req.params;
    
        try {
            const favorite = await getFavoritebyIndex(userId, productId);
            res.json(favorite);
        } catch{}
    });
    


users.get("/:userId/products/:productId", async (req , res) => {
    const {userId , productId} = req.params

    try{
        const product = await getProductByIndex(userId , productId)
        res.json(product)
    }
    catch(error){
        res.status(404).json({ error: error.message });
    }
})


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















      users.post("/:userId/purchases/:productsId", async (req , res) => {
        const {userId , productsId} = req.params;
    
        const successfulAdd = await addPurchaseToUser(userId, productsId)
       
        console.log(successfulAdd)
    
        if(successfulAdd ){
            res.json({message: "Product Added"});
        }
        else{
            res.json({error: "Product not added"})
        }
    
    })

    

    users.delete("/:userId/purchases/:productsId", async (req , res) => {
        const { userId, productsId } = req.params

        const deleteProduct = await deletePurchasesFromUsers(userId , productsId)

        console.log(deleteProduct)

        if(deleteProduct.users_id){
            res.status(200).json(deleteProduct)
        }
    })

    users.get("/:userId/purchases", async (req, res) => {
        const { userId } = req.params;
       
        const filters = req.query

        const userProducts = await getAllPurchaseForUser(userId);

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


      users.get("/:userId/purchases/:productId", async (req , res) => {
        const {userId , productId} = req.params
    
        try{
            const product = await getPurchasebyIndex(userId , productId)
            if(product){
                res.status(200).json(product)
            }
        }
        catch{
            res.status(404).json({error: "No Purchases Found"})
        }
    })
    



    module.exports = users