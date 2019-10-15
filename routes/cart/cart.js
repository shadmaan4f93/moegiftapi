module.exports = () => {
    // const fs = require("fs"),
    // ms = require("mongoose"),
    extend = require("util")._extend,
    //Product = require('../products/products'),
    utils = require('../util')(),
      { Cart, Product} = require("../../models/model")();
  
    return require("./cart.factory")({
        Product,
        Cart,
        extend,
        utils
    });
  };