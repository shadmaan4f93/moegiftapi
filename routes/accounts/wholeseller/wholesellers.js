module.exports = () => {
    const extend = require("util")._extend,
      { Wholeseller } = require("../../../models/model")();
  
    return require("../wholeseller/wholesellers.factory")({
        extend,
        Wholeseller
    });
  };
  