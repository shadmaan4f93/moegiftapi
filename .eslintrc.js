"use strict";

const OFF = "off";
const ERROR = "error";
const WARN = "warn";

module.exports = {
   "env": {
       "browser": true,
       "es6": true
   },
   "extends": "eslint:recommended",
   "globals": {
       "Atomics": "readonly",
       "SharedArrayBuffer": "readonly"
   },
   "parserOptions": {
       "ecmaVersion": 2018,
       "sourceType": "module"
   },
   "rules": {
       "semi": ERROR,
       "no-undef": OFF,
       "quotes": OFF,
       "space-before-blocks" : ERROR,
       "keyword-spacing" : ERROR,
       "no-empty" : ERROR,
       "no-multi-spaces" : ERROR,
       "no-console" : OFF,
       "no-unused-vars" : WARN,
       "strict" : OFF
   }
};