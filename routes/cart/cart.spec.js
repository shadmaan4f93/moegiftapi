const assert = require('assert');
var request = require('request');
let chai = require('chai');
var expect = require('chai').expect(),
    mongoose = require('mongoose');

describe("To test Cart functionality", () => {
    describe("get All Cart", function () {
        it("should return a list of Cart", function (done) {
            var options = {
                url: 'http://localhost:5000/cart'
            };
            request.get(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while retirving Cart data from the database");
                done();
            });
        });
    });

    describe("Create Cart", function () {
        it("should insert a Cart into the database", function (done) {
            const userData = {
                "email": "wholeseller@example.com",
                "password": "test@123",
                "type": "wholeseller"
            };
            var options = {
                url: 'http://localhost:5000/cart/addtocart',
                body: userData,
                json: true
            };
            request.post(options, function (err, res, body) {
                assert.ok(body["statuscode"] == 200, "An error occured while inserting Cart data into the database");
                done();
            });
        });
    });

    describe("Update Cart", function () {
        it("should update a Cart into the database", function (done) {
            const userData = {
                "firstName": "dsfsfa",
                "lastName": "dafa"
            };
            var options = {
                url: 'http://localhost:5000/cart/35aabcda-22e3-4871-bc5f-38e0b02d349b',
                body: userData,
                json: true
            };
            request.put(options, function (err, res, body) {
                assert.ok(body["statuscode"] == 200, "An error occured while updating Cart data into the database");
                done();
            });
        });
    });

    describe("Get Cart by Id", function () {
        it("should get Cart data by id from database", function (done) {
            var options = {
                url: 'http://localhost:5000/cart/f575516b-0503-48a7-ab04-66563c0a9b69'
            };
            request.get(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while retirving Cart data by id from database");
                done();
            });
        });
    });


    describe("Delete Cart by Id", function () {
        it("should remove Cart data by id from database", function (done) {
            var options = {
                url: 'http://localhost:5000/cart/del/67821300-bab5-4bad-9a45-2587b95fdff4'
            };
            request.delete(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while deleting Cart data by id from database");
                done();
            });
        });
    });

    after(() => {
        mongoose.connection.models = {};
    });
});
