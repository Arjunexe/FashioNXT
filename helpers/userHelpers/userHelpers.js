const { model } = require("mongoose")
const db = require("../../models/connection")
const bcrypt = require("bcrypt")


module.exports={

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

  doSignUp:(data) => {
    let obj = {}
    return new Promise(async (resolve, reject) => {
        try {
            await db.user.findOne({ email: data.email }).then(async (res) => {
                if (!res) {
                    data.password = await bcrypt.hash(data.password, 10)
                    userData = {
                        username: data.username,
                        email: data.email,
                        phonenumber: data.phonenumber,
                        password: data.password

                    // Password: hashedPassword
                        

                    }
                    let userDb = await db.user(userData)
                    userDb.save()
                    obj.status = true
                    obj.data = userDb

                    resolve(obj)
                } else {

                    resolve({ status: false })
                }
            })

        } catch (error) {
            console.log(error, "Login failed");
        }
    })
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


  getUserNumber: (mobileNumber) => {
    try {
      return new Promise((resolve, reject) => {
        db.user.find({ phonenumber: mobileNumber }).then((user) => {
          if (user) {
            resolve({status : true , message : "User found"});
          } else {
            resolve({status : false , message : "User not found"})
          }
        }).catch((error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.log(error.message);
    }
  },


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


  getShopProducts: (req) => {
    return new Promise((resolve, reject) => {
      db.Product.find().then((product) => {
        if (product) {
          resolve(product);
        } else {
          reject(new Error("No products found"));
        }
      }).catch((error) => {
        reject(error); // Propagate any error occurred during the find() operation
      });
    });
  },



  getProductDetail: (proId) => {
    try {
     
        return new Promise((resolve, reject) => {
            db.Product.findById({ _id: proId }).then((product) => {
                resolve(product)
            })
        })
    } catch (error) {
        console.log(error.message);
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





}



