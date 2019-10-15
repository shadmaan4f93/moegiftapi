
module.exports = () => {
  const fs = require("fs");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");
  const uuid = require("uuid/v4");
  const guidvalidate = require('uuid-validate');
  const nodemailer = require("nodemailer");
  const CryptoJS = require("crypto-js");
  const dropboxV2Api = require('dropbox-v2-api');
  const { appConfig } = require('../src/setup')();
  const Nexmo = require('nexmo');

  const dropbox = dropboxV2Api.authenticate({
    token: appConfig.mydropbox.accesstoken
  });


  //=====================================================================================================


  //==========================================================================================================================
  async function imageUploads(incomingfile, productinfo, productName) {

    try {
      var return_value = {
        "response": null,
        "error": null
      }
      let file_path = incomingfile.path;
      let file_extension = incomingfile.mimetype.substr(incomingfile.mimetype.lastIndexOf('/') + 1);
      var allowed_extension = ["jpeg", "jpg", "png", "tif", "gif"];
      return new Promise(function (resolve, reject) {
        if (allowed_extension.includes(file_extension)) {
          dropbox({
            resource: `${appConfig.mydropbox.uploadResource}`,
            parameters: {
              path: `${appConfig.mydropbox.pathToBox}${productinfo}${productName}.${file_extension}`,
              autorename: true
            },
            readStream: fs.createReadStream(file_path)
          }, (err, result) => {
            if (result) {
              dropbox({
                resource: `${appConfig.mydropbox.sharableurlResource}`,
                parameters: {
                  path: result.path_display,
                  settings: {
                    requested_visibility: 'public'
                  }
                }
              }, (err, lresult) => {
                if (lresult) {
                  let fabricated_url = lresult.url
                  var re = /dl=0/;
                  fabricated_url = fabricated_url.replace(re, 'raw=1');
                  fs.unlinkSync(file_path);
                  return_value["response"] = fabricated_url;
                  resolve(return_value)
                } else {
                  return_value["error"] = err;
                  resolve(return_value)
                }
              });
            } else {
              return_value["error"] = err;
              resolve(return_value)
            }
          });
        } else {
          return_value["error"] = "bad extension!";
          resolve(return_value)
        }

      })
    } catch (error) {
      return_value["error"] = error;
      return return_value
    }
  }


  //=====================================================================================================


  // To read any json file .

  //To encrypt password .
  function encryptPasword(password, callback) {
    console.log("setPassword", password);
    bcrypt.genSalt(5, function (err, salt) {
      if (err) {
        return callback(err);
      } else {
        bcrypt.hash(password, salt, null, function (err, hash) {
          if (err) {
            return callback(err);
          } else {
            password = hash;
            console.log("hashed pwd", password);
            callback(null, password);
          }
        });
      }
    });
  }

  /**
   *
   * @param source : user input password
   * @param target : password that is going to be compared with source
   * @param callback
   */
  function verifyPassword(source, target, callback) {
    bcrypt.compare(source, target, function (err, isMatch) {
      if (err) return cb(err, null);
      cb(null, isMatch);
    });
  }

  //=====================================================================================================

  // To generate authtoken
  function generateAuthToken(token_options, callback) {
    try {
      let payload = {
        exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, //24hour
        id: token_options.id,
        scope: token_options.type,
        username: token_options.username
      };
      const token = jwt.sign(payload, appConfig.session.secret); //get the private key from the config file -> environment variable
      callback(null, token)
    } catch (error) {
      callback(error, null)
    }
  }

  //=====================================================================================================

  // to verify token
  function verifyAuthToken(req, res, next) {

    var return_value = {
      "statuscode": null,
      "message": null,
      "data": []
    };
    try {
      if (!req.headers.authorization) {
        return_value["statuscode"] = 401;
        return_value["message"] = "access Denied !! No token provided.";
      }
      else {
        const token = req.headers.authorization.substr(7);
        const decoded = jwt.verify(token, appConfig.secret);
        return_value["statuscode"] = 200;
        return_value["message"] = "success";
        return_value["data"] = decoded;
        res.json(return_value);

      }

    } catch (exception) {
      return_value["statuscode"] = 400;
      return_value["message"] = "Bad Request";
      res.json(return_value);
    }
  }

  //=====================================================================================================
  // To genearte UUID
  function generateUUID() {
    const GUID = uuid();
    return GUID;
  }

  function validateUUID(guid) {
    let validation = guidvalidate(guid);
    if (validation) {
      result = true;
    }
    else {
      result = false;
    }
    return result;
  }

  //=====================================================================================================


  // setup text message to the user
 function sendTextSms(req, res) {
  const from = "MOE";
  const to = "91" + req.phone;
  const text = "Your order has been placed successfully";
  let nexmo = new Nexmo(appConfig.opt);
  nexmo.message.sendSms(from, to, text)
}

//=====================================================================================================
  //order confirmation 
function orderConfirmationMail(useremail) {
  let mailto = useremail;
  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: appConfig.fromEmail,
      pass: appConfig.emailPass
    }
  });
  var mailOptions = {
    from: "MOE-Gifts :heavy_check_mark: <devmoegifts123@gmail.com>", // sender address
    to: mailto, // list of receivers
    subject: "Order Confirmation.", // Subject line
    text: "Your Order has been placed successfully" // plaintext body
  }

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: " + response.message);
    }
  });
}

//=====================================================================================================

  // To send mails to user for account recovery purposes.
  async function mailSender(useremail) {

    try {

      var return_value = {
        "response": null,
        "error": null
      }
      var xuri = "http://localhost:3000/resetpassword?authcode="
      cotp = await otpGenerator(useremail);
      return new Promise(function (resolve, reject) {
        let mailto = useremail;


        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: appConfig.fromEmail,
            pass: appConfig.emailPass
          }
        });

        var mailOptions = {
          from: "MOE-Gifts ✔ <devmoegifts123@gmail.com>", // sender address
          to: mailto, // list of receivers
          subject: "forgot password", // Subject line
          text: "grab the otp send to you ✔", // plaintext body
          html: `${xuri}${cotp}`
          //html: `<a href="http://localhost:3000/resetpassword?authcode=${cotp}"></a>` // html body
        }

        smtpTransport.sendMail(mailOptions, function (error, response) {
          if (error) {
            return_value["error"] = error
            return_value["response"] = null
            resolve(return_value);
          } else {
            return_value["error"] = null
            return_value["response"] = response
            resolve(return_value);
          }
        });
      });
    } catch (error) {
      return_value["error"] = error
      return_value["response"] = null
      resolve(return_value);

    }

  }

  //=====================================================================================================

  // Generating otp for sending mails.
  async function otpGenerator(useremail) {
    try {
      var user_info = [{ email: useremail }, { time: Date.now() }]
      var ciphertext = CryptoJS.Rabbit.encrypt(JSON.stringify(user_info), 'useremail', { padding: CryptoJS.pad.NoPadding.unpad });
      //var ciphertext = CryptoJS.AES.encrypt(useremail, "useremail");
      console.log(ciphertext.toString());
      return ciphertext.toString();

    } catch (error) {
      return JSON.stringify(error)
    }
  }

  //=====================================================================================================
 

  // Matching otp send from user for verification
  async function otpMatcher(otp) {
    try {
      var return_value = {
        "response": null,
        "email": null
      }
      trimmed_otp = otp.replace(/ /g, '+');
      var bytes = CryptoJS.Rabbit.decrypt(trimmed_otp.toString(), "useremail");
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      request_time = Date.now();
      otp_issueTime = decryptedData[1]["time"];
      timeThresholhing = request_time - otp_issueTime // 5  min 
      if (timeThresholhing < 60000) {
        return_value["response"] = true;
        return_value["email"] = decryptedData[0]["email"];
      }
      else {
        return_value["response"] = false;
      }
      return return_value;
    } catch (error) {
      return false;
    }

  }

  //=====================================================================================================
  return {
    encryptPasword,
    verifyPassword,
    generateAuthToken,
    generateUUID,
    mailSender,
    otpMatcher,
    verifyAuthToken,
    imageUploads,
    validateUUID,
    orderConfirmationMail,
    sendTextSms
  };
};
