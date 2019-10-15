module.exports = () => {
    const fs = require("fs"),
    extend = require("util")._extend,
    utils = require('../util')(),
      { User, Order,Product} = require("../../models/model")();
  
    return require("./orders.factory.js")({
        User,
        extend,
        Order,
        utils,
        Product,
        fs
    });
  };