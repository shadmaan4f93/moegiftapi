module.exports = () => {
  // stripe = require('stripe')("pk_test_CXnSYpJAezn3L17wl3cYc2rm00zVSP20k1"),
  const {Feedback} = require('../../models/model')();
  extend = require("util")._extend;
  utils = require('../util')();
  return require('./feedback.factory')({
    Feedback,
    extend,
    utils
  });
};


