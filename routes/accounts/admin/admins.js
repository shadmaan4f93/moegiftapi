module.exports = () => {
    const extend = require("util")._extend,
    { Admin } = require("../../../models/model")();
    utils = require('../../../routes/util')();
  
    return require("../admin/admins.factory")({
        extend,
        utils,
        Admin
    });
  };
  