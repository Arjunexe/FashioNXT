const session = require('express-session')
const adminHelper = require('../../helpers/adminHelpers/adminLoginHelper')
const auth = require ('../../middlewares/middleware')
const adminOrderHelper = require ('../../helpers/adminHelpers/adminOrderHelper')
const orderHelpers = require ('../../helpers/userHelpers/orderHelper')
const userController = require ('../../controller/userController/userController')


module.exports = {


// GET ORDER LIST 
getOrderList: (req, res) => {
  let userId = req.params.id
  let admin = req.session.admin
  // orderHelpers.getAddress(userId).then((address) => {
  adminHelper.getUserList(userId).then((user) => {
     
      orderHelpers.getOrders(userId).then((order) => {
         
          res.render('admin/orderList', { layout: 'admin-layout', user, userId, admin, order })
      })
  })

},



//  GET ORDER DETAILS
getOrderDetails: async (req, res) => {
  let admin = req.session.admin
  let orderId = req.query.orderId
  let userId = req.query.userId
  let userDetails = await userController.getDetails(userId)
  orderHelpers.getOrderAddress(userId, orderId).then((address) => {
      orderHelpers.getSubOrders(orderId, userId).then((orderDetails) => {
          orderHelpers.getOrderedProducts(orderId, userId).then((product) => {
              orderHelpers.getTotal(orderId, userId).then((productTotalPrice) => {
                  orderHelpers.getOrderTotal(orderId, userId).then((orderTotalPrice) => {
                    
    
           res.render('admin/orderDetails', { layout: 'admin-layout', admin, userDetails, address, product, orderId,orderDetails, productTotalPrice, orderTotalPrice
                      })
                  })
              })
          })
      })
  })
},








}