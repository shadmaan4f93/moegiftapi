module.exports = () => {
    const fs = require("fs"),
    extend = require("util")._extend,
    utils = require('../../util')(),
      { User,Category,Product } = require("../../../models/model")();
  
    return require("./categories.factory")({
        User,
        Category,
        extend,
        Product,
        utils,
        fs
    });
  };