
const user = require('../../models/connection')
const adminHelper = require('../../helpers/adminHelpers/adminLoginHelper')
const auth = require('../../middlewares/middleware')
const session = require('express-session')





// GET SIGNUP

const adminLogin = {


  // getAdminlogin: (req, res) => {
  //   if(req.session.adminIn){
  //     res.render('admin/admin-dashboard', { layout: "admin-layout" })
  //       }else{
  //         res.render('/admin/login',{layout:"admin-layout"})
  //       }
  // },

  // ALREADY

  //   postAdminlogin: (req, res) => {

  //     adminHelpers.doAdminLogin(req.body).then((response) => {
  //         if (response.status) {

  //           req.session.admin = response
  //           req.session.adminIn = true;

  //           res.redirect("/");
  //         } else {
  //           res.redirect("/admin/admin-login");
  //         }
  //     })
  // },





  // postAdminlogin:(req,res)=>{
  //   adminHelpers.doAdminLogin(req.body).then((response)=>{
  //     req.session.adminIn = true
  //     req.session.admin = response

  //     let loggedinAstatus = response.loggedinAstatus 

  //     if(loggedinAstatus){
  //       res.redirect('/')
  //     }
  //   })
  // },


  // getAdminlogin:(res,req)=>{
  //   if(req.session.adminIn){
  //     res.render('/admin/admin-dashboard', {layout:"admin-layout"} )
  //   }else{
  //     res.render('/admin/admin-login',{layout:"admin-layout"})
  //   }
  // },

  // postAdminlogin:(res,req)=>{
  //   adminHelper.doAdminLogin(req.body).then((response)=>{
  //     req.session.adminIn=true
  //     req.session.admin=response

  //     let loggedinAstatus = response.loggedinAstatus
  //     if (loggedinAstatus==true){
  //       res.render("/admin-admin-dashboard")
  //     }else{
  //       res.redirect('/login')
  //     }
  //   })

  // },

  getLogin: (req, res) => {
    if (req.session.admin) {

      let admin = req.session.admin
      res.render('admin/admin-dashboard', { layout: 'admin-layout', admin })
    } else {
      res.redirect('/admin/admin-login')
    }

  },


  postLogin: (req, res) => {
    let data = req.body
    adminHelper.doAdminLogin(data).then((loginAction) => {
      req.session.admin = loginAction
      res.send(loginAction)
    })
  },

  getDashboard: (req, res) => {
    if (req.session.admin) {

      let admin = req.session.admin
      res.render('admin/admin-dashboard', { layout: 'admin-layout', admin, dashboard: true })
    } else {
      res.redirect('/admin/admin-login')
    }

  },


  doLogout: (req, res) => {
    req.session.admin = null
    res.redirect = ('/admin/login')

  },


  getLogout: (req, res) => {

    req.session.admin = null;
    req.session.loggedIn = false;

    res.redirect("/admin/login");

  },



  getUser: (req, res) => {


    let admin = req.session.admin
    adminHelper.getUserList().then((user) => {
      res.render('admin/admin-userList', { layout: 'admin-layout', user, admin, userPage: true })
    })
  },


  changeUserStatus: (req, res) => {
    let userId = req.query.id
    let status = req.query.status
    if (status === 'false') {
      req.session.user = null
    }
    adminHelper.changeUserHStatus(userId, status).then((status) => {
      res.send(status)
    })
  },


  getAddProduct: async (req, res) => {

    let admin = req.session.admin
    let categories = await user.Category.find()
    res.render('admin/addProduct', { layout: 'admin-layout', categories, admin })
  },
  //PENDING
  // getAddProduct: async (req, res) => {
  //   try {
  //     if (req.session.adminLogIn) {
  //       await productHelpers.getCategory().then((data) => {
  //         let admins = req.session.admin;
  //         res.render("admin/add-product", {  
  //           layout: "adminLayout",
  //           admins,
  //           data,
  //         });
  //       });
  //     } else {
  //       res.redirect("/admin/adminLogin");
  //     }
  //   } catch (error) {
  //     res.status(500);
  //   }
  // }







  getProductList: (req, res) => {
    let admin = req.session.admin
    adminHelper.getProductList().then((product) => {
      res.render('admin/productList', { layout: 'admin-layout', product, admin, productPage: true})
    })
  },


  getEditProduct: (req, res) => {
    let admin = req.session.admin
    let proId = req.params.id;
    adminHelper.getEditProduct(proId).then(async (product) => {
      let category = await user.Category.find()
      res.render('admin/editProduct', { layout: 'admin-layout', product, category, admin })
    })

  },



  postEditProduct: async (req, res) => {
    let proId = req.params.id
    let file = req.files
    let image = [];

    let previousImages = await adminHelper.getPreviousImages(proId)

    //console.log(previousImages, 'oldimage');
    //console.log(file, 'uploaded');


    if (req.files.image1) {
      image.push(req.files.image1[0].filename)
    } else {
      image.push(previousImages[0])
    }

    if (req.files.image2) {
      image.push(req.files.image2[0].filename)
    } else {
      image.push(previousImages[1])
    }
    if (req.files.image3) {
      image.push(req.files.image3[0].filename)
    } else {
      image.push(previousImages[2])
    }
    if (req.files.image4) {
      image.push(req.files.image4[0].filename)
    } else {
      image.push(previousImages[3])
    }

    adminHelper.postEditProduct(proId, req.body, image).then(() => {
      res.redirect('/admin/productList')
    })
  },


  //DELETE PRODUCT------------------------------------------------
  // deleteProduct: (req, res) => {
  //   let proId = req.params.id
  //   adminHelper.deleteProduct(proId).then((response) => {
  //       res.send(response)
  //   })
  // },




  // postAddProduct: (req,res) => {
  //   console.log(req.body,'body');
  //   let data = req.body
  //   try {
  //       return new Promise((resolve, reject) => {
  //           let product = new user.Product(data);
  //           product.save().then(() => {
  //               resolve()
  //           })

  //       })
  //   } catch (error) {
  //       console.log(error.message);
  //   }
  // },




  //POST ADD PRODUCT

  postAddProduct: (req, res) => {
    let file = req.files
    const fileName = file.map((file) => {
      return file.filename
    })
    // console.log(file);
    const product = req.body
    product.img = fileName
    adminHelper.postAddProduct(product).then(() => {
      res.render('admin/admin-dashboard', { layout: "admin-layout" })
    })
  },


  //GET ADD CATEGORY

  getAddCategory: async (req, res) => {
    let admin = req.session.admin
    let categories = await user.Category.find()
    res.render('admin/addCategory', { layout: 'admin-layout', categories, admin, catPage: true })
  },


  //POST ADD CATEGORY

  postAddCategory: (req, res) => {
    let data = req.body
    adminHelper.postAddCategory(data).then((category) => {
      res.send(category)
    })
  },

  //EDIT CATEGORY

  handleEditCategorys: async (req, res) => {
    try {
      const catId = req.params.id;
      const category = await user.Category.findById(catId)
      if (category) {
        // console.log(category, 'category');
        res.status(200).json(category);
      } else {
        res.status(404).json({ message: 'Somthing went wrong..' });
      }

    } catch (error) {
      res.status(404).redirect('/error')
    }
  },


  //EDIT CATEGORY PATCH

  handleEditCategoryPatch: async (req, res) => {
    try {
      // Check if sub-category already exists in the database
      const category = await user.Category.findOne({
        _id: req.body._id,
        sub_category: {
          $elemMatch: {
            name: req.body.newSubCat
          }
        }
      });

      if (category) {
        // Sub-category already exists, update the discount and dates
        await user.Category.updateOne(
          { _id: req.body._id, "sub_category.name": req.body.newSubCat },
          {
            $set: {
              "sub_category.$.offer.discount": req.body.offer_percentage,
              "sub_category.$.offer.validFrom": req.body.valid_from,
              "sub_category.$.offer.validTo": req.body.valid_to
            }
          }
        );
        // Find all products associated with the subcategory and update their prices
        const products = await user.Product.find({ sub_category: req.body.newSubCat })
        products.forEach(async (product) => {
          const originalPrice = product.price
          const discount = req.body.offer_percentage / 100
          const discountedPrice = Math.floor(originalPrice - (originalPrice * discount));
          // console.log(discountedPrice,'discount');
          // console.log(originalPrice,'originalPrice');
          // console.log(req.body.discount,'req.body.discount');
          // console.log(req.body,'req.body');

          await user.Product.updateOne(
            { _id: product._id },
            {
              $set: {
                discountedPrice: discountedPrice
              }
            })
        })
      } else {
        // Sub-category doesn't exist, push it into the sub_category array with the discount and dates
        await user.Category.updateOne(
          { _id: req.body._id },
          {
            $push: {
              sub_category: {
                name: req.body.newSubCat,
                offer: {
                  discount: req.body.offer_percentage,
                  validFrom: req.body.valid_from,
                  validTo: req.body.valid_to
                }
              }
            }
          }
        );
      }

      res.status(200).json({ message: "Sub-category updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  //GET SUB CATEGORY

  getSubCategory: (req, res) => {
    let data = req.body
    adminHelper.getSubCategory(data).then((subCategory) => {
      res.send(subCategory)
    })
  },

  //REMOVE SUB CATEGORY

  removeSubCategory: (req, res) => {
    let cartId = req.params.id
    adminHelper.deleteSubCategory(cartId, req.body.newSubCat).then((response) => {
      res.send(response)
    })
  },


  //DELETE CATEGORY

  deleteCategory: (req, res) => {
    let catId = req.params.id
    adminHelper.deleteCategory(catId).then((response) => {
      res.send(response)
    })
  },


  //LIST AND UNLIST PRODUCT 

  UnlistProduct: async (req, res) => {
    let condition = (req.body.condition);
    let proId = req.body.proId;
    await adminHelper.unlistProduct(proId, condition).then((product) => {
      res.json(true);
    });
  },



}




module.exports = adminLogin;




