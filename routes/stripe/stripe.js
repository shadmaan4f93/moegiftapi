module.exports = () => {
  // stripe = require('stripe')("pk_test_CXnSYpJAezn3L17wl3cYc2rm00zVSP20k1"),
  stripe = require("stripe")("sk_test_YiVEfhnqo2IbUGh4mKajUUZL007CKitr4u"),
  {User} = require('../../models/model')();
  utils = require('../util')();
  
  return require('./stripe.factory')({
    stripe,
    User
  });
};


