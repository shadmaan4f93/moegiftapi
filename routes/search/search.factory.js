module.exports = ({
    Product
}) => {
    //------------------------------------------------------------------------------------
    function getProductByName(req, res) {
        try {
            var keyword = req.body.name;
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            Product.find({ name: { $regex: keyword, $options: 'i' } }, function (error, doc) {
                if (error) {
                    return_value.statuscode = 400;
                    return_value.message = err;
                } else {
                    return_value.statuscode = 200;
                    return_value.message = "success!";
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

    //------------------------------------------------------------------------------------
    function getfilteredProduct(req, res) {
        try {
            const category = req.body.category;
            const subcategory = req.body.subcategory;
            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };

            if ((!category || category == "") && (subcategory == "" || !subcategory)) {
                return_value.statuscode = 400;
                return_value.message = "category or subcategory not defined , isnull or empty !!! ";
                res.json(return_value);
            }
            else {
                Product.find(
                    { $or: [{ category: category }, { subcategory: subcategory }] }, function (error, doc) {
                        if (error) {
                            return_value.statuscode = 400;
                            return_value.message = err;
                        } else if (doc.length > 0) {
                            return_value.statuscode = 200;
                            return_value.message = "success!";
                            return_value.data = doc;
                        }
                        else {
                            return_value.statuscode = 200;
                            return_value.message = "category does not exist !!!";
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

    return {
        getProductByName,
        getfilteredProduct
    };
};
