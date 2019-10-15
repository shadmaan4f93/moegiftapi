const assert = require('assert');
var request = require('request');
let chai = require('chai');
var expect = require('chai').expect(),
    mongoose = require('mongoose');

describe("To test user functionality", () => {
    describe("getAllUser", function () {
        it("should return a list of users", function (done) {
            var options = {
                url: 'http://localhost:5000/user'
            };
            request.get(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while retirving user data from the database");
                done();
            });
        });
    });

    // describe("Create user", function () {
    //     it("should insert a user into the database", function (done) {
    //         const userData = {
    //             "firstName": "ashutosh2",
    //             "lastName": "kumar",
    //             "email": "ashutosh1.infom@gmail.com",
    //             "password": "user1234@123",
    //             "type": "User"
    //         };
    //         var options = {
    //             url: 'http://localhost:5000/user',
    //             body: userData,
    //             json: true
    //         };
    //         request.post(options, function (err, res, body) {
    //             //console.log("Responseeeee ",res);
    //             //console.log("Bodyyyyy ",body);
    //             assert.ok(body["statuscode"] == 200, "An error occured while inserting user data into the database");
    //             done();
    //         });
    //     });
    // });

    describe("Update user", function () {
        it("should update a user into the database", function (done) {
            const userData = {
                "firstName": "ashutosh2",
                "lastName": "kumar1"
            };
            var options = {
                url: 'http://localhost:5000/user/a1704b05-0e81-414c-b1ec-122a66581392',
                body: userData,
                json: true
            };
            request.put(options, function (err, res, body) {
                assert.ok(body["statuscode"] == 200, "An error occured while updating user data into the database");
                done();
            });
        });
    });

    describe("Get user by Id", function () {
        it("should get data by id from database", function (done) {
            var options = {
                url: 'http://localhost:5000/user/b72444f9-bb9d-4b20-8c3c-1f72427bdf28'
            };
            request.get(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while retirving user data by id from database");
                done();
            });
        });
    });

    describe("Delete user by Id", function () {
        it("should remove data by id from database", function (done) {
            var options = {
                url: 'http://localhost:5000/user/69a51b46-1342-4a51-a16d-e8d86511aa5d'
            };
            request.delete(options, function (err, res, body) {
                body = JSON.parse(body);
                assert.ok(body["statuscode"] == 200, "An error occured while deleting user data by id from database");
                done();
            });
        });
    });

    after(() => {
        mongoose.connection.models = {};
    });
});
