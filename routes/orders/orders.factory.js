module.exports = ({
    Order,
    extend,
    utils,
    User
}) => {

    //---------------------------------------------------------------------------------------------------------

    async function postOrder(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": []
        };
        try {
            if (req.body) {
                var opt = extend({}, req.body);
                let new_quantity = req.body.quantity;
                unit_price = opt.orderItems[0].priceUs;
                new_total = parseInt(new_quantity) * parseFloat(unit_price);
                opt.orderTotal = new_total;
                opt.orderId = utils.generateUUID();
                var order = new Order(opt);
                order.save(function (err, Orderdoc) {
                    if (err) {
                        return_value.statuscode = 400;
                        return_value.message = String(err);
                    } else if (Orderdoc) {
                        User.findOne({ "id": Orderdoc.userId }, function (error, userDoc) {
                            if (userDoc.email && userDoc.phone) {
                                utils.sendTextSms(userDoc);
                                utils.orderConfirmationMail(userDoc.email);
                            }
                        });
                        return_value.statuscode = 200;
                        return_value.message = "success";
                        return_value.data = [Orderdoc];
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
    async function updateOrder(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": []
        };
        try {
            let orderId = req.params.id;
            let new_quantity = req.body.quantity;

            Order.findOne({ "orderId": orderId }, function (err, orderdoc) {
                if (err) {
                    return_value.statuscode = 422;
                    return_value = err == null ? "issue with provided Id" : err;
                    res.json(return_value);
                } else if (orderdoc) {
                    var opt = extend({}, req.body);
                    unit_price = opt.orderItems[0].priceUs;
                    new_total = parseInt(new_quantity) * parseFloat(unit_price);

                    opt.modifiedAt = new Date();
                    opt.orderTotal = new_total;
                    opt.orderId = orderdoc.orderId;
                    opt.userId = orderdoc.userId;

                    Order.findOneAndUpdate({ "orderId": orderId }, opt, { new: true }, function (err, newdoc) {
                        if (err) {
                            return_value.statuscode = 400;
                            return_value.message = err;
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
                    return_value.message = "order with the provided Id does not exist";
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
    //----------------------------------------------------------------------------------

    // listing all the orders.
    async function getAllOrder(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": null
        };
        try {
            Order.
                find({}).select("-__v -_id").
                populate({ path: 'userDetail', select: '-password -__v -_id' }).
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

    //------------------------------------------------------------------------------------

    // getting order on behalf of orderid
    function getOrderById(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": []
        };
        try {
            var id = req.params.id;
            Order.findOne({ "orderId": id }, function (err, doc) {
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
                    return_value.message = "! failure as order with provided was not foumd !";
                }
                res.json(return_value);
            }).select("-__v -_id");
        } catch (error) {
            return_value.statuscode = 500;
            return_value.message = String(error);
            res.json(return_value);
        }
    }

    //-------------------------------------------------------------------------------------

    function getOrderByUserId(req, res) {
        var return_value = {
            "count": 0,
            "statuscode": null,
            "message": null,
            "data": []
        };
        try {
            var id = req.params.userId;
            Order.find({ "userId": id }, function (err, doc) {
                if (err) {
                    return_value.statuscode = 400;
                    return_value.message = err;
                } else if (doc) {
                    let len = doc.length;
                    return_value.count = len;
                    return_value.statuscode = 200;
                    return_value.message = "success";
                    return_value.data = doc;
                }
                else {
                    return_value.statuscode = 404;
                    return_value.message = "! failure as orderId was provided not foumd !";
                }
                res.json(return_value);
            }).select("-__v -_id");
        } catch (error) {
            return_value.statuscode = 500;
            return_value.message = String(error);
            res.json(return_value);
        }
    }

    //-------------------------------------------------------------------------------------
    async function delOrderById(req, res) {
        var return_value = {
            "statuscode": null,
            "message": null,
            "data": []
        };
        try {
            Order.deleteOne({ orderId: req.params.id }, function (err, doc) {
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
        postOrder,
        getAllOrder,
        updateOrder,
        delOrderById,
        getOrderById,
        getOrderByUserId
    };
};