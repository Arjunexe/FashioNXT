const db = require ('../../models/connection')
const { ObjectId, DBRef, Db } = require('mongodb');
const { promises } = require('dns');
const { resolve } = require('path');





module.exports = {



  // GET ADDRESS
  getAddress: (userId) => {
    return new Promise((resolve, reject) => {
        db.Address.findOne({ user: userId }).then((response) => {
            resolve(response)
        })

    })
},


// POST ADDRESS
  postAddress: (data, userId) => {
    try {
     
        return new Promise((resolve, reject) => {
            let addressInfo = {
                fname: data.fname,
                lname: data.lname,
                street: data.street,
                appartment: data.appartment,
                city: data.city,
                state: data.state,
                zipcode: data.zipcode,
                phone: data.phone,
                email: data.email
            }

            db.Address.findOne({ user: userId }).then(async (ifAddress) => {
                if (ifAddress) {
                    db.Address.updateOne(
                        { user: userId },
                        {
                            $push: { Address: addressInfo }
                        }
                    ).then((response) => {
                        resolve(response)
                       
                    })
                } else {
                    let newAddress = db.Address({ user: userId, Address: addressInfo })

                    await newAddress.save().then((response) => {
                        resolve(response)
                    })
                }
            })
        })
    } catch (error) {
        console.log(error.message);
    }
  },





  

















// GET ORDER
getOrders: (userId) => {
  try {
      return new Promise((resolve, reject) => {
          db.Order.findOne({ user: userId }).then((user) => {
              resolve(user)
          })
      })
  } catch (error) {
      console.log(error.message);
  }
},




// PLACE ORDER
placeOrder: (data,userId) => {
  
    try {
        let flag = 0
       
        return new Promise(async (resolve, reject) => {
            let productDetails = await db.Cart.aggregate([
                {
                    $match: {
                        user: new ObjectId(userId)
                    }
                },
                {
                    $unwind: '$cartItems'
                },
                {
                    $project: {
                        item: "$cartItems.productId",
                        quantity: "$cartItems.quantity"
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "item",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                {
                    $unwind: "$productDetails"

                },
                {
                    $project: {

                        productId: "$productDetails._id",
                        productName: "$productDetails.name",
                        productPrice: "$productDetails.price",
                        brand: "$productDetails.brand",
                        quantity: "$quantity",
                        category: "$productDetails.category",
                        image: "$productDetails.img"
                    }
                }
            ])
            console.log(productDetails,'productDetails');

            let Address = await db.Address.aggregate([
                {
                    $match: { user: new ObjectId(userId) }
                },
                {
                    $unwind: "$Address"
                },
                {
                    $match: { "Address._id": new ObjectId(data.address) }
                },
                {
                    $project: { item: "$Address" }
                }
            ])
            console.log(Address,'Address');

            let status, orderStatus;
            if (data.payment_option === "COD") {
                status = "Placed",
                    orderStatus = "Success"

            }  else {
                status = "Pending",
                    orderStatus = "Pending"
            }

            let orderData = {
                name: Address[0].item.fname,
                paymentStatus: status,
                paymentMethod: data.payment_option,
                productDetails: productDetails,
                shippingAddress: Address,
                orderStatus: orderStatus,
                totalPrice: data.discountedAmount
            }
            let order = await db.Order.findOne({ user: userId })


            if (flag == 0) {
                if (order) {
                    await db.Order.updateOne(
                        { user: data.user },
                        {
                            $push: { orders: orderData }
                        }
                    ).then((response) => {
                        resolve(response)
                    })
                } else {
                    let newOrder = db.Order({
                        user: data.user,
                        orders: orderData
                    })
                    await newOrder.save().then((response) => {
                        resolve(response)
                    })
                }

                //inventory management 
                // update product quantity in the database
                for (let i = 0; i < productDetails.length; i++) {
                    let purchasedProduct = productDetails[i];
                    let originalProduct = await db.Product.findById(purchasedProduct.productId);
                    let purchasedQuantity = purchasedProduct.quantity;
                    originalProduct.quantity -= purchasedQuantity;
                    await originalProduct.save();
                    await db.Cart.deleteMany({ user: data.user }).then(() => {
                        resolve()
                    })

                }

            }

        })
    } catch (error) {
        throw error;
    }
},









 // GET ORDER ADDRESS
getOrderAddress: (userId, orderId) => {
    return new Promise((resolve, reject) => {
        db.Order.aggregate([
            {
                $match: {
                    "user": new ObjectId(userId)
                }
            },
            {
                $unwind: "$orders"
            },
            {
                $match: {
                    "orders._id": new ObjectId(orderId)
                }
            },
            {
                $unwind: "$orders.shippingAddress"
            },
            {
                $project: {
                    "shippingAddress": "$orders.shippingAddress"
                }
            }
        ]).then((address) => {
            resolve(address)
        })

    })
},






// GET SUBORDER
getSubOrders: (orderId, userId) => {
    try {
        return new Promise((resolve, reject) => {
            db.Order.aggregate([
                {
                    $match: {
                        'user': new ObjectId(userId)
                    }
                },
                {
                    $unwind: '$orders'
  
                },
                {
                    $match: {
                        'orders._id': new ObjectId(orderId)
                    }
                }
  
            ]).then((order) => {
                resolve(order)
            })
        })
    } catch (error) {
        console.log(error.message);
    }
  },





// GET ORDERED PRODUCTS
getOrderedProducts: (orderId, userId) => {
    try {
        return new Promise((resolve, reject) => {
            db.Order.aggregate([
                {
                    $match: {
                        "user": new ObjectId(userId)
                    }
                },
                {
                    $unwind: "$orders"
                },
                {
                    $match: {
                        "orders._id": new ObjectId(orderId)
                    }
                },
                {
                    $unwind: "$orders.productDetails"
                },
                {
                    $project: {
                        "productDetails": "$orders.productDetails"
                    }
                }
            ]).then((response) => {
                resolve(response)
            })
        })
    } catch (error) {
        console.log(error.message);
    }
  },
  
  





// GET TOTAL
getTotal: (orderId, userId) => {
    try {
        return new Promise((resolve, reject) => {
            db.Order.aggregate([
                {
                    $match: {
                        "user": new ObjectId(userId)
                    }
                },
                {
                    $unwind: "$orders"
                },
                {
                    $match: {
                        "orders._id": new ObjectId(orderId)
                    }
                },
                {
                    $unwind: "$orders.productDetails"
                },
                {
                    $project: {
                        "productDetails": "$orders.productDetails",
  
                        "totalPrice": { $multiply: ["$orders.productDetails.productPrice", "$orders.productDetails.quantity"] }
                    }
                }
            ]).then((response) => {
                resolve(response)
            })
        })
    } catch (error) {
        console.log(error.message);
    }
  },
  
  






// GET OREDERED TOTAL
getOrderTotal: (orderId, userId) => {
    try {
        return new Promise((resolve, reject) => {
            db.Order.aggregate([
                {
                    $match: {
                        "user": new ObjectId(userId)
                    }
                },
                {
                    $unwind: "$orders"
                },
                {
                    $match: {
                        "orders._id": new ObjectId(orderId)
                    }
                },
                {
                    $unwind: "$orders.productDetails"
                },
                {
                    $group: {
                        _id: "$orders._id",
                        totalPrice: { $sum: "$orders.productDetails.productPrice" }
                    }
                }
  
            ]).then((response) => {
                if (response && response.length > 0) {
                    const orderTotal = response[0].totalPrice
                    resolve(orderTotal)
                }
            })
        })
    } catch (error) {
        console.log(error.message);
    }
  },





  // GET EDIT ADDRESS
  getEditAddress: (addressId, userId) => {
    return new Promise((resolve, reject) => {
        db.Address.aggregate([
            {
                $match: {
                    user: new ObjectId(userId)
                }
            },
            {
                $project: {
                    address: {
                        $filter: {
                            input: "$Address",
                            as: "item",
                            cond: { $eq: ["$$item._id", new ObjectId(addressId)] }
                        }
                    }
                }
            }
        ])
            .then(result => {
                if (result.length === 0) {
                    resolve(null); // Address not found
                } else {
                    resolve(result[0].address[0]); // Return the matched address
                }
            })
            .catch(error => {
                reject(error);
            });
    });
},





// PATCH EDIT ADDRESS
patchEditAddress: (userId, addressId, UserData) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Address
                .updateOne(
                    {
                        user: new ObjectId(userId),
                        "Address._id": new ObjectId(addressId),
                    },
                    {
                        $set: {
                            "Address.$": UserData,
                        },
                    }
                )
                .then((response) => {
                    resolve(response);
                });
        } catch (error) {
            reject(error);
        }
    });
},








//CANCEL ORDER
cancelOrder: (orderId) => {
    try {
        return new Promise((resolve, reject) => {
            db.Order.find({ 'orders._id': orderId }).then((orders) => {
                let orderIndex = orders[0].orders.findIndex((orders) => orders._id == orderId);
                let order = orders[0].orders.find((order) => order._id == orderId);

             if (order.paymentMethod === 'COD' && order.orderConfirm === 'Delivered' && order.paymentStatus === 'paid') {
                    // Update order status in the database
                    db.Order.updateOne(
                        { 'orders._id': orderId },
                        {
                            $set: {
                                ['orders.' + orderIndex + '.orderConfirm']: 'Canceled',
                                ['orders.' + orderIndex + '.paymentStatus']: 'Refunded'
                            }
                        }
                    ).then((orders) => {
                        resolve(orders)
                    });
                } else {
                    // Update order status in the database
                    db.Order.updateOne(
                        { 'orders._id': orderId },
                        {
                            $set: {
                                ['orders.' + orderIndex + '.orderConfirm']: 'Canceled'
                            }
                        }
                    ).then((orders) => {
                        resolve(orders)
                    });
                }
            });
        });
    } catch (error) {
        console.log(error.message);
    }
},




// FIND ORDER
findOrder: (orderId, userId) => {
    try {
        return new Promise((resolve, reject) => {
            db.Order.aggregate([
                {
                    $match: {
                        "orders._id": new ObjectId(orderId),
                        user: new ObjectId(userId)
                    }  
                },
                {
                    $unwind: "$orders"
                },
            ]).then((response) => {
                let orders = response.filter((element) => {
                    if (element.orders._id == orderId) {

                        return true;
                    }
                    return false;
                }).map((element) => element.orders);
                resolve(orders)
            })
        })
    } catch (error) {
        console.log(error.message);
    }
},






// FIND PRODUCT
findProduct: (orderId, userId) => {
    try {
        return new Promise((resolve, reject) => {
            db.Order.aggregate([
                {
                    $match: {
                        "orders._id": new ObjectId(orderId),
                        user: new ObjectId(userId)
                    }
                },
                {
                    $unwind: "$orders"
                },



            ]).then((response) => {
                let product = response.filter((element) => {
                    if (element.orders._id == orderId) {

                        return true;
                    }
                    return false;
                }).map((element) => element.orders.productDetails);
                resolve(product)
            })
        })
    } catch (error) {
        console.log(error.message);
    }
},





// FIND ADDRESS
findAddress: (orderId, userId) => {
    try {
        return new Promise((resolve, reject) => {
            db.Order.aggregate([
                {
                    $match: {
                        "orders._id": new ObjectId(orderId),
                        user: new ObjectId(userId)
                    }
                },
                {
                    $unwind: "$orders"
                },
                {
                    $unwind: "$orders.shippingAddress"
                },
                {
                    $replaceRoot: { newRoot: "$orders.shippingAddress.item" }
                },
                {
                    $project: {
                        _id: 1,
                        fname: 1,
                        lname: 1,
                        street: 1,
                        appartment: 1,
                        city: 1,
                        state: 1,
                        zipcode: 1,
                        phone: 1,
                        email: 1
                    }
                }
            ]).then((response) => {
                // console.log(response[0].phone,'[[');
                resolve(response)
            })
        })
    } catch (error) {
        console.log(error.message);
    }
},





changeOrderStatus: (orderId, status) => {
    try {
        return new Promise((resolve, reject) => {
            db.Order.updateOne(
                { 'orders._id': orderId },
                {
                    $set: { 'orders.$.orderConfirm': status }
                }).then((response) => {

                    resolve(response)
                })
        })
    } catch (error) {
        console.log(error.message);
    }
},






}