module.exports = ({
    Product,
    extend,
    Cart,
    utils
}) => {
    //============================ Create category ==========================================
    async function addProductTocart(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": []
        };
        try {
            if (req.body) {
                let opt = extend({}, req.body);
                opt.item = {};
                await Product.findOne({ "id": req.body.item.id }, function (err, res) {
                    opt.item = res;
                    opt.totalpayable = res.priceUs;
                });
                console.log(`item : ${opt}`);
                opt.quantity = 1;
                opt.id = utils.generateUUID();
                opt.createdAt = new Date();
                opt.modifiedAt = new Date();
                var cart = new Cart(opt);
                cart.save(function (error, doc) {
                    if (error) {
                        return_value.statuscode = 400;
                        return_value.message = String(error);
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
            return_value.statuscode = 500;
            return_value.message = String(error);
            res.json(return_value);
        }
    }
    //----------------------------------------------------------------------------------
    function getCart(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": []
        };
        try {
            Cart.find({}, function (err, doc) {
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
            return_value.statuscode = 500;
            return_value.message = String(error);
            res.json(return_value);
        }
    }

    //----------------------------------------------------------------------------------
    function getCartById(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": []
        };
        try {
            var id = req.params.id;
            Cart.findOne({ "id": id }, function (err, doc) {
                if (err) {
                    return_value.statuscode = 400;
                    return_value.message = err;
                } else {
                    return_value.statuscode = 200;
                    return_value.message = "success!!";
                    return_value.data = doc;
                }
                res.json(return_value);
            }).select("-__v -_id");
        } catch (error) {
            return_value.statuscode = 500;
            return_value.message = String(error);
            res.json(return_value);
        }
    }

    //----------------------------------------------------------------------------------
    async function delCartById(req, res) {
        try {
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            Cart.deleteOne({ id: req.params.id }, function (err, doc) {
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
            return_value.statuscode = 500;
            return_value.message = String(error);
            res.json(return_value);
        }
    }

    //----------------------------------------------------------------------------------
    async function updateCartById(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": []
        };
        try {
            let cartId = req.params.id;
            let cartQty = req.body.quantity;
            Cart.findOne({ "id": cartId }, function (err, cartDoc) {
                if (err) {
                    return_value.statuscode = 422;
                    return_value = err == null ? "issue with with provided Id" : err;
                    res.json(return_value);
                } else if (cartDoc) {
                    let unit_price = cartDoc.item.priceUs;
                    let new_total = parseInt(cartQty) * parseFloat(unit_price);
                    var opt = extend({}, req.body);
                    opt.modifiedAt = new Date();
                    opt.item = cartDoc.item;
                    opt.totalpayable = new_total;
                    opt.id = cartDoc.id;
                    Cart.findOneAndUpdate({ "id": cartId }, opt, { new: true }, function (error, newdoc) {
                        if (error) {
                            return_value.statuscode = 400;
                            return_value.message = error;
                        }
                        else {
                            return_value.statuscode = 200;
                            return_value.message = "success";
                            return_value.data = newdoc;
                        }
                        res.json(return_value);
                    }).select("-__v -_id ");
                }
                else {
                    return_value.statuscode = 404;
                    return_value.message = "Cart with the provide Id does not exist";
                    res.json(return_value);
                }
            });
        }
        catch (error) {
            return_value.statuscode = 500;
            return_value.message = String(error);
            res.json(return_value);
        }
    }
    return {
        addProductTocart,
        updateCartById,
        getCart,
        getCartById,
        delCartById
    };

};