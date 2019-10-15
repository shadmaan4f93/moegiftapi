module.exports = ({

    SubCategory,
    extend,
    utils

}) => {

    //---------------------------------------------------------------------------------------------------------
    function postSubCategory(req, res) {
        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            if (req.body) {
                var opt = extend({}, req.body);
                opt.id = utils.generateUUID();
                var subcategory = new SubCategory(opt);
                subcategory.save(function (err, doc) {
                    if (err) {
                        return_value.statuscode = 400;
                        return_value.message = String(err);
                    } else {
                        return_value.statuscode = 200;
                        return_value.message = "Saved successfully";
                        return_value.data = doc;
                    }
                    res.json(return_value);
                });

            } else {
                return_value.statuscode = 400;
                return_value.message = "Bad request!";
                res.json(return_value);
            }

        } catch (error) {
            return_value.statuscode = 5000;
            return_value.message = String(error);
            res.json(return_value);
        }
    }
    //----------------------------------------------------------------------------------
    function GetAllSubCategory(req, res) {
        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            SubCategory.find({}, function (err, doc) {
                if (err) {
                    return_value.statuscode = 400;
                    return_value.message = err;
                } else {
                    return_value.statuscode = 200;
                    return_value.message = "data fetched successfully";
                    return_value.data = doc;
                }
                res.json(return_value);
            }).select("-__v -_id ");

        } catch (error) {
            return_value.statuscode = 5000;
            return_value.message = String(error);
            res.json(return_value);
        }

    }

    //----------------------------------------------------------------------------------
    function GetSubCategoryById(req, res) {
        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            var id = req.params.id;
            SubCategory.findOne({ "id": id }, function (err, doc) {
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
                    return_value.message = "! failure as product with provided was not foumd !";
                }
                res.json(return_value);
            }).select("-__v -_id ");
        } catch (error) {
            return_value.statuscode = 5000;
            return_value.message = String(error);
            res.json(return_value);
        }
    }
    //----------------------------------------------------------------------------------
    function DelSubCategoryById(req, res) {
        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            SubCategory.deleteOne({ id: req.params.id }, function (err, doc) {
                if (err) {
                    return_value.statuscode = 400;
                    return_value.message = err;
                } else if (doc.n > 0) {
                    return_value.statuscode = 200;
                    return_value.message = "data deleted successfully";
                }
                else {
                    return_value.statuscode = 400;
                    return_value.message = "internal error ";
                }
                res.json(return_value);
            });
        }
        catch (error) {
            return_value.statuscode = 5000;
            return_value.message = String(error);
            res.json(return_value);
        }
    }

    //----------------------------------------------------------------------------------
    function updateSubCategory(req, res) {
        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            var opt = extend({}, req.body);
            opt.modifiedAt = new Date();
            opt.id = req.params.id;
            SubCategory.findOneAndUpdate({ id: req.params.id }, opt, { new: true }, function (err, doc) {
                if (err) {
                    return_value.statuscode = 400;
                    return_value.message = err;
                } else {
                    return_value.statuscode = 200;
                    return_value.message = "data updated successfully";
                    return_value.data = doc;
                }
                res.json(return_value);
            }).select("-__v -_id ");
        }
        catch (error) {
            return_value.statuscode = 5000;
            return_value.message = String(error);
            res.json(return_value);
        }
    }
    //----------------------------------------------------------------------------------
    return {
        postSubCategory,
        updateSubCategory,
        DelSubCategoryById,
        GetSubCategoryById,
        GetAllSubCategory
    };

};