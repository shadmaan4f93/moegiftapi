module.exports = () => {
    const extend = require("util")._extend,
    { User } = require("../../../models/model")();
  
    return require("../user/users.factory")({
        User,
        extend
    });
  };
  