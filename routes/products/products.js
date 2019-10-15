module.exports = () => {
  const fs = require("fs"),
    extend = require("util")._extend,
    utils = require('../util')(),
    { Product } = require("../../models/model")();

  return require("./products.factory")({
    Product,
    extend,
    fs,
    utils
  });
};