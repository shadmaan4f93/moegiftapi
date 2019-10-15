module.exports = ({
    Product,
    extend,
    utils,
    formidable,
    multer,
    save
}) => {

    async function UploadProductImage(req, res) {
        try {

            var return_value = {
                "statuscode": null,
                "message": null,
                "data": []
            };
            upload = multer({ dest: 'uploads/' });

            if (req.file) {
                var image_path = req.file.path;
                const result = utils.dropboxUploader(image_path);
                res.json(result);

            }
            else {
                res.json(return_value);
            }
        } catch (error) {
            return_value.statuscode = 422;
            return_value.message = String(err);
            res.json(return_value);
        }
    }

    async function GetProductImageById(req, res) {

    }

    async function GetAllProductImages(req, res) {

    }
    return {
        UploadProductImage,
        GetProductImageById,
        GetAllProductImages
    };
};