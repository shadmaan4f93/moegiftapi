module.exports = () => {
    const fs = require("fs"),
    extend = require("util")._extend,
    utils = require('../util')(),
      { User,Wholeseller,Admin} = require("../../models/model")();
  
    return require("./auth.factory")({
        User,
        Wholeseller,
        Admin,
        extend,
        fs,
        utils
    });
  };
  