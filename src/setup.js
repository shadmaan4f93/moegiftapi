/**
 * Setup.js, authored by Shadmaan[mohd.shadmaan@softmindinfotech.com]
 * This module configures the api with the correct settings.
 * @param {Object} securityKey Accepts a Json Object that contains the security keys
 */

const fs = require('fs');
module.exports = () => {
      let file = fs.readFileSync("security-keys.json", "utf8"); 
      var securityKey = JSON.parse(file);
      const {
        MONGO_HOST: mongoHost = securityKey.database.dbhost,
        MONGO_PORT: mongoPort = securityKey.database.dbhost,
        MONGO_USER: mongoUser = securityKey.database.dbuser,
        MONGO_PASS: mongoPass = securityKey.database.dbpass,
        MONGO_BDNAME: mongoDbName = securityKey.database.dbname,
        API_PORT: apiPort = 5000,
        DEV_ENV: devEnv = "local"
      } = process.env;
      
      // Setup app configuration
      const appConfig = {
        domain:"moe-gifts-api",
        dbName : "moegifts",
        secret: securityKey.session.secret,
        docSrc: "public",
        fromEmail: securityKey.adminemail,
        emailPass: securityKey.emailpass,
        subdomain: {
          api: "moe-gifts-api"
        },

        opt: {
          apiKey: securityKey.opt.apiKey,
          apiSecret: securityKey.opt.apiSecret
        },
     
        serverMode : devEnv,
        dbSessions : `mongodb+srv://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDbName}?retryWrites=true&w=majority/sessions`,
        protocol : "http",
        port : apiPort,
        docDist : "dist", //document root, not documentation
        pg : securityKey.moegifts.dev,
        session : securityKey.session,
      };
      
      // Extra intilization
      appConfig.dbPath = `mongodb+srv://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDbName}?retryWrites=true&w=majority`;
      //appConfig.clusetrPath = `mongodb+srv://adminqwe:admin1234@cluster0-t6deg.mongodb.net/test?retryWrites=true&w=majority`
      appConfig.staticPath = appConfig.docSrc + "/static/";

      appConfig.mydropbox = securityKey.mydropbox;
      global.appConfig = {};
      global.appConfig.serverMode = appConfig.serverMode;
      global.appConfig.pg = appConfig.pg;
      return {
        appConfig
      };
  };
