const { model } = require("mongoose")
const db = require("../../models/connection")
const bcrypt = require("bcrypt")
const { log } = require("console")
const { ObjectId } = require('mongodb')


module.exports = {

    // MAIN SIGNUP

    // doSignUp: (userData) => {
    //   return new Promise(async (resolve, reject) => {

    //     try {
    //       email = userData.email;
    //       existingUser = await db.user.findOne({ email })
    //       if (existingUser) {
    //         return resolve({status:true})

    //       }
    //       else {

    //         let hashedPassword = await bcrypt.hash(userData.password, 10);
    //         const data = new db.user ({

    //           username: userData.username,
    //           password: hashedPassword,
    //           email: userData.email,
    //           phonenumber: userData.phonenumber,
    //         })


    //         await data.save(data).then((data) => {
    //           resolve({ data, status: false })
    //         })
    //       }
    //     }

    //     catch (err) {
    //     }


    //   })

    // },

    doSignUp: async (data) => {
        try {
            const obj = {};

            // Check if email or phone already exists
            const existingUser = await db.user.findOne({
                $or: [
                    { email: data.email },
                    { phonenumber: data.phonenumber }
                ]
            });

            if (existingUser) {
                obj.status = false;
                obj.message = (existingUser.email === data.email)
                    ? "Email already registered"
                    : "Phone number already registered";
                return obj;
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const userData = {
                username: data.username,
                email: data.email,
                phonenumber: data.phonenumber,
                password: hashedPassword,
            };

            const newUser = await db.user.create(userData);

            obj.status = true;
            obj.data = newUser;
            return obj;

        } catch (error) {
            console.error("Signup Error:", error);
            throw error; // so controller can handle it
        }
    },





    // doSignUp: (data) => {

    //   return new Promise(async (resolve, reject) => {
    //     try {
    //       let email = data.email;
    //       let existingUser = await db.user.findOne({ email });
    //       if(existingUser) {
    //          resolve({ status: false });
    //       } else {
    //         let hashedPassword = await bcrypt.hash(data.password, 10);
    //         let data = new db.user({
    //           username: data.username,
    //           Password: hashedPassword,
    //           email: data.email,
    //           phonenumber: data.phonenumber,
    //         });

    //         await data.save().then((data) => {
    //           resolve({ status: true });
    //         });
    //       }
    //     } catch (err) {
    //       throw err;
    //     }
    //   });
    // },












    // MAIN DO LOGIN


    // doLogin: (userData) => {

    //   return new Promise(async (resolve, reject) => {

    //     let userName
    //     let id

    //     try {
    //       let response = {}

    //       let users = await db.user.findOne({ email: userData.email })
    //       if (users) {


    //         if (users.status == true) {


    //           await bcrypt.compare(userData.password, users.password).then((loginTrue) => {
    //             if (loginTrue) {
    //               userName = users.username
    //               id = users._id
    //               response.status = true
    //               response.user

    //               resolve({ response})

    //             } else {
    //               resolve({ status: false })
    //             }
    //           }  )
    //       }
    //       else{

    //         ({blocked : true})

    //       }   

    //         }
    //           else {

    //         resolve({ status: false })
    //       }
    //     } catch (err) {  
    //     }
    //   })


    // }

    doLogin: (data) => {

        return new Promise(async (resolve, reject) => {
            try {

                await db.user.findOne({ email: data.email }).then((user) => {

                    let response = {}
                    if (user) {

                        if (user.status == true) {

                            bcrypt.compare(data.password, user.password).then((loginTrue) => {

                                if (loginTrue) {
                                    response.user = user
                                    response.status = true
                                    resolve(response)
                                } else {
                                    console.log("login failed");
                                    resolve({ status: false })
                                }
                            })
                        } else {
                            resolve({ blocked: true })
                        }
                    } else {
                        console.log("login failed");
                        resolve({ status: false })
                    }
                })
            } catch (error) {
                console.log(error.message);
            }
        })
    },












    // doLogin: (userData) => {
    //   return new Promise(async (resolve, reject) => {
    //     try {
    //       let response = {};
    //       let users = await db.user.findOne({ email: userData.email });
    //       if (users) {
    //         if (users.blocked == false) {
    //           await bcrypt.compare(userData.password, users.Password).then((status) => {
    //             if (status) {
    //               const userName = users.username;
    //               const id = users._id;
    //               resolve({ response, loggedinstatus: true, userName, id });
    //             } else {
    //               // Return an error message indicating that the login attempt failed
    //               const errorMessage = "Incorrect email or password.";
    //               resolve({ loggedinstatus: false, errorMessage });
    //             }
    //           });
    //         } else {
    //           const errorMessage = "Your account has been blocked. Please contact support for assistance.";
    //           resolve({ blockedStatus: true, errorMessage });
    //         }
    //       } else {
    //         const errorMessage = "Incorrect email or password.";
    //         resolve({ loggedinstatus: false, errorMessage });
    //       }
    //     } catch (err) {
    //       // Return an error message indicating that there was a server error
    //       const errorMessage = "An unexpected error occurred. Please try again later.";
    //       resolve({ loggedinstatus: false, errorMessage });
    //     }
    //   });
    // }


    //   getUserNumber: (mobileNumber) => {
    //     try {
    //       return new Promise((resolve, reject) => {
    //         db.user.find({ phonenumber: mobileNumber }).then((user) => {
    //           if (user) {
    //             resolve({status : true , message : "User found"});
    //           } else {
    //             resolve({status : false , message : "User not found"})
    //           }
    //         }).catch((error) => {
    //           reject(error);
    //         });
    //       });
    //     } catch (error) {
    //       console.log(error.message);
    //     }
    //   },


    //GET SHOP PRODUCTS

    // getShopProducts:(req)=>{

    //   return new Promise((resolve,reject)=>{
    //     db.Product.find().then((product)=>{
    //       if(product){
    //         resolve(product)
    //       }else{
    //         reject(console.log("erorr"))
    //       }
    //     })
    //   })


    // },



    // GET SHOP PRODUCTS FIRST

    // getShopProducts: (req) => {
    //   return new Promise((resolve, reject) => {
    //     db.Product.find().then((product) => {
    //       if (product) {
    //         resolve(product);
    //       } else {
    //         reject(new Error("No products found"));
    //       }
    //     }).catch((error) => {
    //       reject(error); // Propagate any error occurred during the find() operation
    //     });
    //   });
    // },



    getProductDetail: async (proId) => {
        try {
            const product = await db.Product.findById(proId);
            return product;
        } catch (error) {
            throw error;
        }
    },


    //  GET USER
    getUser: (userId) => {
        try {
            return new Promise((resolve, reject) => {
                db.user.findById({ _id: userId }).then((response) => {
                    resolve(response)
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    },






    // PAGINATION
    documentCount: () => {
        return new Promise(async (resolve, reject) => {
            await db.Product.find().countDocuments().then((documents) => {

                resolve(documents);
            })
        })
    },



    addProduct: (proId, userId) => {
        return new Promise((resolve, reject) => {
            db.Cart.aggregate([
                { $match: { user: new ObjectId(userId) } },
                { $unwind: '$cartItems' },
                { $match: { 'cartItems.productId': new ObjectId(proId) } }
            ])
                .then((foundCart) => {
                    console.log(foundCart, "ooooooooopppppppppppp999999999999");
                    if (foundCart && Array.isArray(foundCart) && foundCart.length !== 0) {
                        resolve({ status: true });

                    } else {
                        resolve({ status: false });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },





    getQueriesOnShop: (query) => {
        const search = query?.search
        const sort = query?.sort
        const filter = query?.filter
        const page = parseInt(query?.page) || 1
        const perPage = 6


        return new Promise(async (resolve, reject) => {

            let filterObj = {}

            if (filter === 'category=Men') {
                filterObj = { category: 'Men' }
            } else if (filter === 'category=Women') {
                filterObj = { category: 'Women' }
            } else if (filter === 'category=Kid') {
                filterObj = { category: 'Kid' }
            }
            console.log(filterObj, 'filterObj');

            //Building search query

            let searchQuery = {}

            if (search) {
                searchQuery = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                }
            }

            //Building object based on query parameter

            let sortObj = {}

            if (sort === '-createdAt') {
                sortObj = { createdAt: -1 };
            } else if (sort === 'createdAt') {
                sortObj = { createdAt: 1 };
            } else if (sort === '-price') {
                sortObj = { price: -1 };
            } else if (sort === 'price') {
                sortObj = { price: 1 };
            }

            const skip = (page - 1) * perPage;
            const product = await db.Product.find({
                ...searchQuery,
                ...filterObj,
            })
                .sort(sortObj)
                .skip(skip)
                .limit(perPage);


            const totalProducts = await db.Product.countDocuments({
                ...searchQuery,
                ...filterObj,
            });

            console.log(searchQuery, 'searchQuery');
            console.log(sortObj, 'sortObj');
            console.log(skip, 'skip');
            console.log(product, 'product');
            console.log(totalProducts, 'totalProducts');

            const totalPages = Math.ceil(totalProducts / perPage);
            if (product.length == 0) {
                resolve({
                    noProductFound: true,
                    Message: "No results found.."
                })
            }
            resolve({
                product,
                noProductFound: false,
                currentPage: page,
                totalPages,
            });

        })

    },




    getAllProducts: async (page, perPage) => {
        const skip = (page - 1) * perPage;
        const product = await db.Product.find()
            .skip(skip)
            .limit(perPage);

        const totalProducts = await db.Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / perPage);

        return {
            product,
            totalPages,
        };
    },




    //GET BANNER
    getAllBanner: () => {
        return new Promise((resolve, reject) => {
            db.Banner.find().then((response) => {
                resolve(response)
            }).catch(error => {
                resolve(error)
            })
        })
    },




    //WISHLIST
    getWishListCount: (userId) => {
        try {
            return new Promise((resolve, reject) => {
                let count = 0
                db.Wishlist.findOne({ user: userId }).then((userWishlist) => {
                    if (userWishlist) {
                        count = userWishlist.wishList.length
                    }
                    resolve(count)
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    },



    getWishListProducts: (userId) => {
        try {
            return new Promise((resolve, reject) => {
                db.Wishlist.aggregate([
                    {
                        $match: {
                            "user": new ObjectId(userId)
                        }
                    },
                    {
                        $unwind: "$wishList"
                    },
                    {
                        $project: {
                            productId: "$wishList.productId",
                            createdAt: "$wishList.createdAt"
                        }
                    },
                    {
                        $lookup: {
                            from: "products",
                            localField: "productId",
                            foreignField: "_id",
                            as: "wishListed"
                        }
                    },
                    {
                        $project: {
                            productId: 1,
                            createdAt: 1,
                            wishListed: { $arrayElemAt: ["$wishListed", 0] }
                        }
                    }
                ]).then((wishListed) => {
                    resolve(wishListed)
                })
            })
        } catch (error) {
            console.log(error.message);
        }

    },







    addWishList: (userId, proId) => {
        try {
            return new Promise((resolve, reject) => {
                db.Wishlist.findOne({ user: new ObjectId(userId) }).then((userWishList) => {
                    if (userWishList) {
                        let productExist = userWishList.wishList.findIndex((wishList) => wishList.productId == proId);
                        if (productExist != -1) {
                            resolve({ status: false });
                        } else {
                            db.Wishlist.updateOne(
                                { user: new ObjectId(userId) },
                                {
                                    $push: {
                                        wishList: { productId: new ObjectId(proId) }
                                    }
                                }
                            ).then(() => {
                                resolve({ status: true });
                            })
                        }
                    } else {
                        let wishListData = {
                            user: new ObjectId(userId),
                            wishList: [{ productId: new ObjectId(proId) }]
                        };
                        let newWishList = new db.Wishlist(wishListData);
                        newWishList.save().then(() => {
                            resolve({ status: true });
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                });
            });
        } catch (error) {
            console.log(error.message);
        }
    },



    removeProductWishlist: (proId, wishListId) => {
        try {
            return new Promise((resolve, reject) => {
                db.Wishlist.updateOne(
                    { _id: wishListId },
                    {
                        $pull: { wishList: { productId: proId } }
                    }
                ).then((response) => {
                    resolve(response)
                })
            })
        } catch (error) {
            console.log(error.message);
        }
    }







}



