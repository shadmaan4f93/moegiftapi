module.exports = ({
  User,
  Wholeseller,
  Admin,
  utils
}) => {

  // established login functionality
  async function login(req, res) {
    try {
      var return_value = {
        "statuscode": null,
        "message": null,
        "token": null,
        "data": null

      };
      if (req.body.email && req.body.password && req.body.type) {
        let useremail = req.body.email;
        let password = req.body.password;
        let type = req.body.type;

        var modelObject;

        switch (type) {

          case "User":
            modelObject = User;
            break;
          case "Admin":
            modelObject = Admin;
            break;
          case "Wholeseller":
            modelObject = Wholeseller;
            break;
        }
        let entity = await modelObject.findOne({ email: useremail });
        if (entity) {
          if (useremail == entity.email && (password == entity.password)) {
            let token_otions = {
              scope: entity.type,
              id: entity.id,
              username: entity.username
            };  
            utils.generateAuthToken(token_otions, function (error, token) {
              if (error) {
                return_value.statuscode = 422;
                return_value.message = "Bad request";
              }
              else {
                return_value.statuscode = 200;
                return_value.message = "success";
                return_value.token = token;
                return_value.data = entity;
              }
            });
          }
          else {
            return_value.statuscode = 401;
            return_value.message = "Invalid Credentials !!! email or password is invalid ";
          }
          res.json(return_value);

        }
        else {
          return_value.statuscode = 401;
          return_value.message = "email not registered";
          res.json(return_value);
        }
      }
      else {
        return_value.statuscode = 404;
        return_value.message = "Email Password Type are required sorry!!!  you cant escape from this .";
        res.json(return_value);
      }
    }
    catch (error) {
      return_value.statuscode = 400;
      return_value.message = JSON.stringify(error.message + "  Reason: type provided is not valid");
      res.json(return_value);
    }
  }

  // setup to recover password if user forgots.
  async function forgotPassword(req, res) {
    try {
      var return_value = {
        "statuscode": null,
        "message": null,
      };

      if (req.body.email && req.body.type) {
        let useremail = req.body.email;
        let type = req.body.type;

        var modelObject;
        switch (type) {

          case "User":
            modelObject = User;
            break;
          case "Admin":
            modelObject = Admin;
            break;
          case "Wholeseller":
            modelObject = Wholeseller;
            break;
        }

        let entity = await modelObject.findOne({ email: useremail });
        if (entity) {

          mailed = await utils.mailSender(useremail);

          if (mailed.response && !mailed.error) {
            return_value["message"] = "success otp sent !!";
            return_value["statuscode"] = 200;
            res.json(return_value);
          }
          else {
            return_value["message"] = "failure";
            return_value["statuscode"] = 400;
            res.json(return_value);
          }
        }
        else {
          return_value["message"] = "email is not registered !!!";
          return_value["statuscode"] = 404;
          res.json(return_value);
        }
      }
      else {
        return_value["message"] = "Bad Request !!! Email & Type are required";
        return_value["statuscode"] = 404;
        res.json(return_value);
      }
    } catch (error) {
      return_value["message"] = JSON.stringify(error);
      return_value["statuscode"] = 404;
      res.json(return_value);
    }
  }

  async function verifyOTP(req, res) {
    try {
      var return_value = {
        "statuscode": null,
        "message": null,
        "data": []
      };

      let authcode = req.query.authcode;
      if (!authcode) {
        return_value["statuscode"] = 200;
        return_value["message"] = "otp is required";
        res.json(return_value);

      } else {
        verification = await utils.otpMatcher(authcode);
        if (verification.response) {
          return_value["statuscode"] = 200;
          return_value["message"] = "success";
          return_value["data"] = verification.email;

        }
        else {
          return_value["statuscode"] = 400;
          return_value["message"] = "failure !! otp is invalid";
        }
        res.json(return_value);
      }
    } catch (error) {
      return_value["statuscode"] = 400;
      return_value["message"] = JSON.stringify(error);
    }
  }


  async function resetPassword(req, res) {

    try {
      var return_value = {
        "statuscode": null,
        "message": null,
      };

      if (!req.body.email || !req.body.type || !req.body.newpassword || !req.body.confirmpassword) {
        return_value["statuscode"] = 400;
        return_value["message"] = "Bad Request Body";
      }
      else {
        var modelObject;
        switch (req.body.type) {
          case "User":
            modelObject = User;
            break;
          case "Admin":
            modelObject = Admin;
            break;
          case "Wholeseller":
            modelObject = Wholeseller;
            break;
        }
        let newpass = req.body.newpassword;
        let confirmpass = req.body.confirmpassword;
        let entity = await modelObject.findOne({ email: req.body.email });
        if (!entity) {
          return_value["statuscode"] = 400;
          return_value["message"] = "Email is not registered";
          res.json(return_value);
        }
        else {
          if (newpass == confirmpass) {
            await entity.updateOne({ password: newpass },
              function (err, success) {
                if (err) {
                  return_value["statuscode"] = 400;
                  return_value["message"] = "Bad Request Body";
                }
                else {
                  return_value["statuscode"] = 200;
                  return_value["message"] = "success";
                }
                res.json(return_value);
              });
          }
          else {
            return_value["statuscode"] = 400;
            return_value["message"] = "newpassword & confirmpassword didn't matched ";
            res.json(return_value);
          }
        }
      }
    } catch (error) {
      return_value["statuscode"] = 400;
      return_value["message"] = JSON.stringify(error);
      res.json(return_value);
    }
  }

  async function Authorize(req, res) {
    try {
      var return_value = {
        "statuscode": null,
        "message": null,
        "data": []
      };
      var authorization = await utils.verifyAuthToken(req, res);
      res.json(authorization);
    } catch (error) {
      return_value.statuscode = 404;
      return_value.message = error;
      res.json(return_value);
    }

  }
  return {
    login,
    forgotPassword,
    resetPassword,
    verifyOTP,
    Authorize
  };
};
