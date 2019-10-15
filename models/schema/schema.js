module.exports = (mongoose) =>{
  const bcrypt = require("bcrypt");
  utils = require('../../routes/util')();
  return require("./schema.factory.js")({ mongoose, bcrypt, utils})
};
