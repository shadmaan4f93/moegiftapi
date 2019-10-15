module.exports = () => {
    const fs = require("fs"),
    ms = require("mongoose"),
    extend = require("util")._extend,
    //Product = require('../products/products'),
    utils = require('../util')(),
      { Product} = require("../../models/model")();
  
    return require("./search.factory")({
        Product
    });
  };