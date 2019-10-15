const assert = require('assert');
var request = require('request');
let chai = require('chai');
var expect = require('chai').expect(),
    mongoose = require('mongoose');

describe("To test Feedback functionality", () => {
    describe("get All Feedback", function () {
        it("should return a list of Feedback", function (done) {
            var options = {
                url: 'http://localhost:5000/feedback'
            };
            request.get(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while retirving Feedback data from the database");
                done();
            });
        });
    });

    describe("Get Feedback by Id", function () {
        it("should get Feedback data by id from database", function (done) {
            var options = {
                url: 'http://localhost:5000/feedback/739e939e-2806-4f96-aec5-dbe6763b6ee6'
            };
            request.get(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while retirving Feedback data by id from database");
                done();
            });
        });
    });


    describe("Create Feedback", function () {
        it("should insert a Feedback into the database", function (done) {
            const userData = {
                "userId": "6054a38b-1080-4eed-ad3d-3f74d1f5209e",
                "username": "asewrw.infome1",
                "productId": "e8585021-dfe3-4c19-ac7f-be4c272ef142",
                "description": "you need to give your thoughts for the given product ",
                "star": 5
            };
            var options = {
                url: 'http://localhost:5000/feedback',
                body: userData,
                json: true
            };
            request.post(options, function (err, res, body) {
                assert.ok(body["statuscode"] == 200, "An error occured while inserting Feedback data into the database");
                done();
            });
        });
    });

    describe("Delete Feedback by Id", function () {
        it("should remove Feedback data by id from database", function (done) {
            var options = {
                url: 'http://localhost:5000/feedback/a19f19c8-8819-41b1-ba79-1b802bf904b1'
            };
            request.delete(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while deleting Feedback data by id from database");
                done();
            });
        });
    });

    after(() => {
        mongoose.connection.models = {};
    });
});
