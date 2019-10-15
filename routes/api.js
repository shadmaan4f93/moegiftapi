var express = require('express'),
apiRouter = express.Router(),
multer  = require('multer'),
upload = multer({ dest: 'temp/' }),
user = require('./accounts/user/users')();
admin = require('./accounts/admin/admins')();
wholeseller = require('./accounts/wholeseller/wholesellers')();
auth = require('./auth/auth')();
product = require('./products/products')();
stripe = require('./stripe/stripe')();
category = require('./products/categories/category')();
subcategory = require('./products/subcategories/subcategories')();
order = require('./orders/orders')();
search = require('./search/search')();
cart   = require('./cart/cart')();
feedback   = require('./feedback/feedback')();

/************************************  Welcome to APIS  *************************************/

apiRouter.get('/', function (req, res) {
  res.json({
    loggedIn: req.isAuthenticated(),
    user: req.user,
    //provider: req.session.provider, // TO DO NEXT TIME
    message: 'Welcome to our API!'
  });
});

apiRouter.get('/failure', function (req, res) {
  res.status(401).json({
    message: 'Login failure!!! '
  });
});



//*****************************************ADMINS ******************************************/
apiRouter.post('/admin', admin.postAdmin);
apiRouter.get('/admin', admin.getAllAdmin);
apiRouter.get('/admin/:id', admin.getAdminById);
apiRouter.put('/admin/:id', upload.single('profileImage'), admin.updateAdmin);
apiRouter.delete('/admin/:id', admin.deleteAdmin);


//***************************************** wholeseller ******************************************/

apiRouter.post('/wholeseller', wholeseller.postWholeseller);
apiRouter.get('/wholeseller', wholeseller.getAllWholeseller);
apiRouter.get('/wholeseller/:id', wholeseller.getWholesellerById);
apiRouter.put('/wholeseller/:id', upload.single('profileImage'), wholeseller.updateWholeseller);
apiRouter.delete('/wholeseller/:id', wholeseller.deleteWholeseller);

//***************************************** User ******************************************/
apiRouter.post('/user', user.postUser);
apiRouter.get('/user', user.getAllUser);
apiRouter.get('/user/:id', user.getUserById);
apiRouter.put('/user/:id', upload.single('profileImage'), user.updateUser);
apiRouter.delete('/user/:id', user.deleteUser);

//**************************************Auth*************************************************/

apiRouter.post('/login', auth.login);
apiRouter.post('/reset', auth.resetPassword);
apiRouter.post('/forgot', auth.forgotPassword);
apiRouter.post('/verify', auth.verifyOTP);
apiRouter.post('/auth', auth.Authorize);


//**************************************PRODUCTS*************************************************/
apiRouter.post('/products/create', upload.single('imageUrl'), product.postProduct);
apiRouter.put('/products/update/:id',upload.single('imageUrl'), product.updateProduct);
apiRouter.get('/products', product.GetAllProduct);
apiRouter.get('/product/:id', product.GetProductById);
apiRouter.delete('/product/del/:id', product.DelProductById);
apiRouter.post('/product/query', product.getProductBYref);


//**************************************CATEGORIES*************************************************/
apiRouter.post('/categories/create', category.postCategory);
apiRouter.put('/categories/update/:id', category.updateCategory);
apiRouter.get('/categories', category.GetAllCategory);
apiRouter.get('/category/:id', category.GetCategoryById);
apiRouter.delete('/category/del/:id', category.DelCategoryById);

//**************************************SUBCATEGORIES*************************************************/
apiRouter.post('/subcategories/create', subcategory.postSubCategory);
apiRouter.put('/subcategories/update/:id', subcategory.updateSubCategory);
apiRouter.get('/subcategories', subcategory.GetAllSubCategory);
apiRouter.get('/subcategory/:id', subcategory.GetSubCategoryById);
apiRouter.delete('/subcategory/del/:id', subcategory.DelSubCategoryById);

//**************************************ORDER*************************************************/
apiRouter.post('/orders/create', order.postOrder);
apiRouter.put('/orders/update/:id', order.updateOrder);
apiRouter.get('/orders', order.getAllOrder);
apiRouter.get('/order/:id', order.getOrderById);
apiRouter.get('/order/userid/:userId', order.getOrderByUserId);
apiRouter.delete('/order/del/:id', order.delOrderById);


//**************************************Serach*************************************************/
apiRouter.post('/product/ByName', search.getProductByName);
apiRouter.post('/Product/filter', search.getfilteredProduct);

//**************************************Cart*************************************************/
apiRouter.post('/cart/addtocart', cart.addProductTocart);
apiRouter.get('/cart', cart.getCart);
apiRouter.get('/cart/:id', cart.getCartById);
apiRouter.put('/cart/:id', cart.updateCartById);
apiRouter.delete('/cart/del/:id', cart.delCartById);

//*****************************************STRIPE ******************************************/
apiRouter.post('/charge', stripe.stripepay);
apiRouter.post('/balance', stripe.getstripebalance);
apiRouter.post('/transaction/detail', stripe.retrieveBalanceTransaction);
apiRouter.get('/disputes', stripe.retrieveAllDisputes);
apiRouter.get('/events', stripe.getIntrestingEventsOnStripe);
apiRouter.post('/payouts', stripe.makePayout);

//*****************************************STRIPE ******************************************/
apiRouter.post('/feedback', feedback.createFeedback);
apiRouter.get('/get', feedback.getAllFeedback);
apiRouter.get('/feedback/get/:id', feedback.getFeedbackById);
apiRouter.delete('/feedback/del/:id', feedback.deleteFeedback);

module.exports = apiRouter;
