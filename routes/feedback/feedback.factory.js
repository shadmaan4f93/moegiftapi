module.exports = ({
  Feedback,
  extend,
  utils
}) => {

  function createFeedback(req, res) {
    var return_value = {
      "statuscode": null,
      "message": null,
      "data": []
    };
    try {
      let opt = extend({}, req.body);
      opt.id = utils.generateUUID();
      let feedback = new Feedback(opt);
      feedback.save((error, doc) => {
        if (error) {
          return_value.statuscode = 400;
          return_value.message = String(error);
        } else {
          return_value.statuscode = 200;
          return_value.message = "Success";
          return_value.data = doc;
        }
        res.json(return_value);
      });
    } catch (error) {
      return_value.statuscode = 500;
      return_value.message = String(error);
      res.json(return_value);
    }
  }


  function getAllFeedback(req, res) {
    var return_value = {
      "statuscode": null,
      "message": null,
      "data": null
    };
    try {
      Feedback.
        find({}).select("-__v -_id").
        exec(function (err, doc) {
          if (err) {
            return_value.statuscode = 400;
            return_value.message = String(err);
          } else {
            return_value.statuscode = 200;
            return_value.message = "success";
            return_value.data = doc;
          }
          res.json(return_value);
        });

    } catch (error) {
      return_value.statuscode = 500;
      return_value.message = String(error);
      res.json(return_value);
    }
  }


  function getFeedbackById(req, res) {
    var return_value = {
      "statuscode": null,
      "message": null,
      "data": []
    };
    try {
      var id = req.params.id;
      Feedback.findOne({ "id": id }, function (err, doc) {
        if (err) {
          return_value.statuscode = 400;
          return_value.message = err;
        } else if (doc) {
          return_value.statuscode = 200;
          return_value.message = "success";
          return_value.data = doc;
        }
        else {
          return_value.statuscode = 404;
          return_value.message = "! failure as feedback with provided was not foumd !";
        }
        res.json(return_value);
      }).select("-__v -_id");
    } catch (error) {
      return_value.statuscode = 500;
      return_value.message = String(error);
      res.json(return_value);
    }
  }

  function deleteFeedback(req, res) {
    var return_value = {
      "statuscode": null,
      "message": null,
      "data": []
    };
    try {
      Feedback.deleteOne({ "id": req.params.id }, function (err, doc) {
        if (err) {
          return_value.statuscode = 400;
          return_value.message = err;
        } else if (doc.n > 0) {
          return_value.statuscode = 200;
          return_value.message = "success";
        }
        else {
          return_value.statuscode = 400;
          return_value.message = "internal error";
        }
        res.json(return_value);
      });
    }
    catch (error) {
      return_value.statuscode = 500;
      return_value.message = String(error);
      res.json(return_value);
    }
  }

  return {
    createFeedback,
    getAllFeedback,
    getFeedbackById,
    deleteFeedback
  };
};
