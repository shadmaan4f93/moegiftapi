module.exports = ({
	extend,
	Wholeseller,
}) => {

	//======================================== Post Wholeseller ===============================================

	async function postWholeseller(req, res) {
		var return_value = {
			"statuscode": null,
			"message": null,
			"data": []
		};
		try {
			let email = req.body.email;
			let password = req.body.password;
			let type = req.body.type;
			if (!email || !password || !type) {
				return_value["statuscode"] = 400;
				return_value["message"] = "Email, password, type are required!";
			} else {
				let username = email.substring(0, email.lastIndexOf("@"));
				result = await Wholeseller.findOne({ "email": email });
				if (result) {
					return_value["statuscode"] = 400;
					return_value["message"] = "Wholeseller allready exist!";
				} else {
					var opt = extend({}, req.body);
					opt.id = utils.generateUUID();
					opt.username = username;
					var wholeseller = new Wholeseller(opt);
					var result = await wholeseller.save();
					return_value["statuscode"] = 200;
					return_value["message"] = "success";
					return_value["data"] = result;
				}
			}
			res.json(return_value);

		} catch (error) {
			return_value["statuscode"] = 400;
			return_value["message"] = JSON.stringify(error);
			res.json(return_value);
		}
	}

	//======================================== Get All Wholeseller ===============================================

	function getAllWholeseller(req, res) {
		var return_value = {
			"statuscode": null,
			"message": null,
			"data": []
		};
		try {
			Wholeseller.find({}, function (error, doc) {
				if (error) {
					return_value["statuscode"] = 400;
					return_value["message"] = JSON.stringify(error);
					res.json(return_value);
				} else {
					return_value["statuscode"] = 200;
					return_value["message"] = "Success";
					return_value["data"] = doc;
					res.json(return_value);
				}
			}).select("-__v -_id -password");
		} catch (error) {
			return_value["statuscode"] = 400;
			return_value["message"] = JSON.stringify(error);
			res.json(return_value);
		}
	}

	//======================================== Get Wholeseller ===============================================

	function getWholesellerById(req, res) {
		var return_value = {
			"statuscode": null,
			"message": null,
			"data": []
		};
		try {
			var id = req.params.id;
			Wholeseller.find({ "id": id }, function (error, doc) {
				if (error) {
					return_value["statuscode"] = 400;
					return_value["message"] = JSON.stringify(error);
					res.json(return_value);
				} else if (doc.length > 0) {
					return_value["statuscode"] = 200;
					return_value["message"] = "Success";
					return_value["data"] = doc;
					res.json(return_value);
				}
				else {
					return_value["statuscode"] = 400;
					return_value["message"] = "Wholeseller with provided id does not exist";
					res.json(return_value);
				}
			}).select("-__v -_id -password");
		} catch (error) {
			return_value["statuscode"] = 400;
			return_value["message"] = JSON.stringify(error);
			res.json(return_value);
		}
	}

	//======================================== Admin update =============================================

	async function updateWholeseller(req, res) {
		var return_value = {
			"statuscode": null,
			"message": null,
			"data": null
		};
		try {
			var ImagePath = null;
			if (req.body.profileImage) {
				ImagePath = req.body.profileImage;
			}
			if (req.file) {
				let adminId = req.params.id;
				imgUploadresponse = await utils.imageUploads(req.file, adminId);
				if (!imgUploadresponse.response) {
					return_value["statuscode"] = imgUploadresponse.error;
					return_value["message"] = "Unable to update!";
					return_value.statuscode = 500;
				} else {
					ImagePath = imgUploadresponse.response;
				}
			}
			var opt = extend({}, req.body);

			opt.profileImage = ImagePath;
			opt.id = req.params.id;
			Wholeseller.findOneAndUpdate({ id: req.params.id }, opt, { new: true }, function (err, doc) {
				if (err) {
					return_value["statuscode"] = 400;
					return_value["message"] = err;
				}
				else {
					return_value["statuscode"] = 200;
					if (req.file && !ImagePath) {
						return_value["message"] = "Image update failed please try again!";
					} else {
						return_value["message"] = "success";
					}
					return_value["data"] = doc;
				}
				res.json(return_value);
			}).select("-__v -_id ");
		} catch (error) {
			return_value["statuscode"] = 200;
			return_value["message"] = "success";
			return_value["data"] = doc;
		}
	}

	//========================================delete Wholeseller ===============================================

	async function deleteWholeseller(req, res) {
		try {
			var return_value = {
				"statuscode": null,
				"message": null,
				"data": []
			};
			Wholeseller.deleteOne({ id: req.params.id }, function (err, doc) {
				if (err) {
					return_value.statuscode = 400;
					return_value.message = err;
				} else if (doc.n > 0) {
					return_value.statuscode = 200;
					return_value.message = "success";
				}
				else {
					return_value.statuscode = 200;
					return_value.message = "Unable to delete Wholeseller!";
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

	//=========================================================================================================
	return {
		postWholeseller,
		getWholesellerById,
		getAllWholeseller,
		updateWholeseller,
		deleteWholeseller
	};
};
