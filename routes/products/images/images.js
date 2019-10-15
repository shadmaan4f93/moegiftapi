module.exports = () => {
  const fs = require("fs"),
    extend = require("util")._extend,
    formidable = require('formidable'),
    multer = require('multer'),
    save = require('save-file');
  utils = require('../../util')(),
    { Product } = require("../../../models/model")();

  return require("./images.factory")({
    Product,
    extend,
    fs,
    utils,
    formidable,
    save,
    multer

  });
};