module.exports = ({
    Product,
    extend,
    utils
}) => {

    //============================ Create Product ==========================================
    async function postProduct(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": null
        };
        try {
            if (!req.body.name || !req.body.title) {
                return_value["message"] = "Name, Title , Category  are required!";
                return_value["statuscode"] = 400;
                res.json(return_value);
            } else {
                var imgUploadresponse;
                let productName = req.body.name;
                let productid = utils.generateUUID();
                let imageid = utils.generateUUID();
                var ImagePath = null;
                if (req.file) {
                    imgUploadresponse = await utils.imageUploads(req.file, imageid, productName);
                    if (imgUploadresponse.response) {
                        ImagePath = imgUploadresponse.response;
                    }
                }
                var opt = extend({}, req.body);
                opt.imageUrl = ImagePath;
                opt.id = productid;
                var product = new Product(opt);
                product.save(function (err, doc) {
                    if (err) {
                        return_value["statuscode"] = 400;
                        return_value["message"] = JSON.stringify(err);
                    }
                    else {
                        return_value["statuscode"] = 200;
                        if (req.file && !ImagePath) {
                            return_value["message"] = `Product image upload failed! Reason: ${imgUploadresponse.error}`;
                        } else {
                            return_value["message"] = "Success";
                        }
                        return_value.data = doc;
                    }
                    res.json(return_value);
                });
            }
        } catch (error) {
            return_value.statuscode = 500;
            return_value.message = String(error);
            res.json(return_value);
        }
    }
    //----------------------------------------------------------------------------------
    function GetAllProduct(req, res) {

        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            Product.
                find({}).
                populate('subCategoryDetails').
                populate('categoryDetails').
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
            return_value.statuscode = 5000;
            return_value.message = String(error);
            res.json(return_value);
        }
    }

    //----------------------------------------------------------------------------------
    function GetProductById(req, res) {
        try {

            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            Product.
                find({ id: req.params.id }).
                populate('subCategoryDetails').
                populate('categoryDetails').
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
            return_value.statuscode = 5000;
            return_value.message = String(error);
            res.json(return_value);
        }
    }

    //----------------------------------------------------------------------------------
    async function DelProductById(req, res) {
        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            Product.deleteOne({ id: req.params.id }, function (err, doc) {
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

    async function updateProduct(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": null
        };

        try {
            if (!req.body.name || !req.body.title || !req.body.category) {
                return_value["message"] = "Name !  category !  Title !   are  required ";
                return_value["statuscode"] = 400;
                res.json(return_value);
            }
            else {
                var ImagePath = null;

                if (req.body.imageUrl) {
                    ImagePath = req.body.imageUrl;
                }

                if (req.file) {
                    let imageid = utils.generateUUID();
                    let productName = req.body.name;
                    imgUploadresponse = await utils.imageUploads(req.file, imageid, productName);
                    if (imgUploadresponse.response) {
                        ImagePath = imgUploadresponse.response;
                    }
                }
                var opt = extend({}, req.body);
                opt.imageUrl = ImagePath;
                opt.id = req.params.id;
                Product.findOneAndUpdate({ id: req.params.id }, opt, { new: true }, function (err, doc) {
                    if (err) {
                        return_value["statuscode"] = 400;
                        return_value["message"] = err;
                    }
                    else {
                        return_value["statuscode"] = 200;
                        if (req.file && !ImagePath) {
                            return_value["message"] = `Product image upload failed! Reason: ${imgUploadresponse.error}`;
                        }
                        else {
                            return_value["message"] = "success";
                        }
                        return_value["data"] = doc;
                    }
                    res.json(return_value);
                }).select("-__v -_id ");
            }

        } catch (error) {
            return_value["statuscode"] = 400;
            return_value["message"] = JSON.stringify();
            res.json(return_value);
        }
    }

    //----------------------------------------------------------------------------------

    async function getProductBYref(req, res) {

        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };

            let subcategoryid = req.body.subcategoryid;
            let categoryid = req.body.categoryid;

            if (subcategoryid || categoryid) {

                if (subcategoryid == undefined) {
                    const result = await Product.find().where({ 'category': categoryid });
                    if (result) {
                        return_value.message = "success";
                        return_value.statuscode = 200;
                        return_value.data = result;
                    }
                    else {
                        return_value.message = "bad request";
                        return_value.statuscode = 400;
                    }
                    res.json(return_value);
                } if (categoryid == undefined) {
                    const result = await Product.find().where({ 'subcategory': subcategoryid });
                    if (result) {
                        return_value.message = "success";
                        return_value.statuscode = 200;
                        return_value.data = result;
                    }
                    else {
                        return_value.message = "bad request";
                        return_value.statuscode = 400;
                    }
                    res.json(return_value);
                }
                if (categoryid && subcategoryid) {
                    const result = await Product.find().where().and([{ subcategory: subcategoryid }, { category: categoryid }]);
                    if (result) {
                        return_value.message = "success";
                        return_value.statuscode = 200;
                        return_value.data = result;
                    }
                    else {
                        return_value.message = "bad request";
                        return_value.statuscode = 400;
                    }
                    res.json(return_value);
                }
            }
            else {
                return_value.message = "category or subcategory required";
                return_value.statuscode = 400;
            }
        } catch (error) {
            return_value.message = error;
            return_value.statuscode = 400;
            res.json(return_value);
        }
    }

    //----------------------------------------------------------------------------------
    return {
        postProduct,
        updateProduct,
        GetAllProduct,
        GetProductById,
        DelProductById,
        getProductBYref
    };

};