module.exports = () => {
  const fs = require("fs"),
    extend = require("util")._extend,
    utils = require('../../util')(),
    { User, Category, Product, SubCategory } = require("../../../models/model")();

  return require("./subcategories.factory")({
    User,
    Category,
    extend,
    Product,
    utils,
    SubCategory,
    fs
  });
};