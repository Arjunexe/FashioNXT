const session = require('express-session')
const orderHelper = require ('../../helpers/userHelpers/orderHelper')
const cartHelper = require ('../../helpers/userHelpers/cartHelper')
const userHelper = require ('../../helpers/userHelpers/userHelpers')
const { ObjectId } = require('mongodb');


module.exports = {



  // GET PROFILE
  getProfile:async (req, res) => {
    var count = null
   
    let userSession = req.session.user
    if (userSession) {
        var count = await cartHelper.getCartCount(userSession._id)

        let userData = await userHelper.getUser(userSession._id)
        let address = await orderHelper.getAddress(userSession._id)
        let orders = await orderHelper.getOrders(userSession._id)
        // let product = await orderHelpers.getProduct()
        res.render('user/profile', { layout: 'Layout', userSession, userData, count, address, orders })
    }

},



  

  // POST ADDRESS
  postAddress: (req, res) => {
    console.log('1111111111111');
    let data = req.body
    let userId = req.session.user._id
    console.log(userId,'222222222222222');
    orderHelper.postAddress(data, userId).then((response) => {
      console.log(response,'reea');
        res.send(response)
    })
},










//  GET CHECKOUT
getCheckout: async (req, res) => {

  let userSession = req.session.user

  if(userSession){

    let userId = req.session.user._id
    let total = await cartHelper.totalCheckOutAmount(userId)
    let count = await cartHelper.getCartCount(userId)
  
    let address = await orderHelper.getAddress(userId)
    cartHelper.getCartItems(userId).then((cartItems) => {
        res.render('user/checkout', { cartItems, total, count, address, userSession })
    })

  }
  
},



// POST CHECKOUT
// postCheckOut: async (req, res) => {
  
//   try {
     
//       let data = req.body;
      
     
     
      
//       try {
//           const response = await orderHelper.placeOrder(data);
         
//           if (data.payment_option === "COD") {
//               res.json({ codStatus: true });
//           } 
//       } catch (error) {
          

//           console.log({error : error.message},'22');
//           res.json({status : false , error : error.message})
//       }
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: error.message });
//   }
// },


postCheckOut: async (req, res) => {
  let userId = req.session.user._id
  try {
    const data = req.body;
      console.log(req.body,'bodyyyyyyyy');
    try {
      const response = await orderHelper.placeOrder(data,userId);

      if (data.payment_option === "COD") {
        res.json({ codStatus: true })

      }else if(data.payment_option === "razorpay"){

        

       } else {
        res.json({ codStatus: false });
      }
    } catch (error) {
      console.error({ error: error.message });
      res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
},




// GET EDIT ADDRESS
getEditAddress:(req,res)=>{
  let userId = req.session.user._id
  let addressId = req.params.id
  orderHelper.getEditAddress(addressId,userId).then((currentAddress)=>{
      res.send(currentAddress)
  })
},






// PATCH EDIT ADDRESS
patchEditAddress:(req,res)=>{
  let addressId = req.params.id
  let userId = req.session.user._id
  let userData = req.body
  orderHelper.patchEditAddress(userId,addressId,userData).then((response)=>{
      res.send(response)
  })
},



//CANCEL ORDER
cancelOrder: (req, res) => {
  let orderId = req.query.id;
  let total = req.query.total;
  let userId = req.session.user._id
  console.log(orderId, req.query.total, req.session.user._id);
  orderHelper.cancelOrder(orderId).then((canceled) => {
  
      res.send(canceled)
      // })
  })
},






// ORDER DETAILS
orderDetails: async (req, res) => {
  let user = req.session.user;
  let count = await cartHelper.getCartCount(user._id)
  let userId = req.session.user._id;
  let orderId = req.params.id;
  orderHelper.findOrder(orderId, userId).then((orders) => {
      orderHelper.findAddress(orderId, userId).then((address) => {
          orderHelper.findProduct(orderId, userId).then((product) => {
              console.log(orders[0].orderConfirm, '====');
              res.render('user/order-details', { layout: 'layout' , user, count, product, address, orders, orderId })
          })
      })
  })
},



changeOrderStatus: (req, res) => {
  let orderId = req.body.orderId
  let status = req.body.status
  orderHelper.changeOrderStatus(orderId, status).then((response) => {
      console.log(response);
      res.send(response)
  })
}







}