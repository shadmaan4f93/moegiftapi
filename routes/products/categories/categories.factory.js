module.exports = ({
    Category,
    extend,
    utils
}) => {

    //============================ Create category ==========================================

    function postCategory(req, res) {
        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            if (req.body) {
                var opt = extend({}, req.body);
                opt.id = utils.generateUUID();
                var category = new Category(opt);
                category.save(function (err, doc) {
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
    function GetAllCategory(req, res) {

        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            Category.find({}, function (err, doc) {
                if (err) {
                    return_value.statuscode = 400;
                    return_value.message = err;
                } else {
                    return_value.statuscode = 200;
                    return_value.message = "success";
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
    function GetCategoryById(req, res) {
        try {

            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            var id = req.params.id;
            Category.findOne({ "id": id }, function (err, doc) {
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
            }).select("-__v -_id");
        } catch (error) {
            return_value.statuscode = 5000;
            return_value.message = String(error);
            res.json(return_value);
        }
    }

    //----------------------------------------------------------------------------------
    async function DelCategoryById(req, res) {
        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            Category.deleteOne({ id: req.params.id }, function (err, doc) {
                if (err) {
                    return_value.statuscode = 400;
                    return_value.message = err;
                } else if (doc.n > 0) {
                    return_value.statuscode = 200;
                    return_value.message = "success";
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
    async function updateCategory(req, res) {
        try {

            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            var opt = extend({}, req.body);
            opt.modifiedAt = new Date();
            opt.id = req.params.id;
            Category.findOneAndUpdate({ id: req.params.id }, opt, { new: true }, function (err, doc) {
                if (err) {
                    return_value.statuscode = 400;
                    return_value.message = err;
                }
                else {
                    return_value.statuscode = 200;
                    return_value.message = "success";
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
        postCategory,
        updateCategory,
        DelCategoryById,
        GetCategoryById,
        GetAllCategory
    };

};