const assert = require('assert');
var request = require('request');
let chai = require('chai');
var expect = require('chai').expect(),
    mongoose = require('mongoose');

describe("To test wholeseller functionality", () => {
    describe("get All wholeseller", function () {
        it("should return a list of wholeseller", function (done) {
            var options = {
                url: 'http://localhost:5000/wholeseller'
            };
            request.get(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while retirving wholeseller data from the database");
                done();
            });
        });
    });

    // describe("Create wholeseller", function () {
    //     it("should insert a wholeseller into the database", function (done) {
    //         const userData = {
    //             "email": "wholeseller@example.com",
    //             "password": "test@123",
    //             "type": "wholeseller"
    //         };
    //         var options = {
    //             url: 'http://localhost:5000/wholeseller',
    //             body: userData,
    //             json: true
    //         };
    //         request.post(options, function (err, res, body) {
    //             assert.ok(body["statuscode"] == 200, "An error occured while inserting wholeseller data into the database");
    //             done();
    //         });
    //     });
    // });

    describe("Update wholeseller", function () {
        it("should update a wholeseller into the database", function (done) {
            const userData = {
                "firstName": "dsfsfa",
                "lastName": "dafa"
            };
            var options = {
                url: 'http://localhost:5000/wholeseller/35aabcda-22e3-4871-bc5f-38e0b02d349b',
                body: userData,
                json: true
            };
            request.put(options, function (err, res, body) {
                assert.ok(body["statuscode"] == 200, "An error occured while updating admin data into the database");
                done();
            });
        });
    });

    describe("Get wholeseller by Id", function () {
        it("should get data by id from database", function (done) {
            var options = {
                url: 'http://localhost:5000/wholeseller/f575516b-0503-48a7-ab04-66563c0a9b69'
            };
            request.get(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while retirving wholeseller data by id from database");
                done();
            });
        });
    });


    describe("Delete wholeseller by Id", function () {
        it("should remove data by id from database", function (done) {
            var options = {
                url: 'http://localhost:5000/wholeseller/67821300-bab5-4bad-9a45-2587b95fdff4'
            };
            request.delete(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while deleting wholeseller data by id from database");
                done();
            });
        });
    });

    after(() => {
        mongoose.connection.models = {};
    });
});
