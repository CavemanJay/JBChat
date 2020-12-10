"use strict";

const chai = require("chai");
const expect = chai.expect;
const server = require("../dist/server");
const io = require("socket.io-client");
const ioOptions = {
  path: "/chat",
};

let sender, receiver;

describe("Events", function () {
  this.timeout(20000);

  this.beforeEach(function (done) {
    server.start(true);

    sender = io("http://localhost:3000", ioOptions);
    receiver = io("http://localhost:3000", ioOptions);

    done();
  });

  this.afterEach(function (done) {
    sender.disconnect(true);
    receiver.disconnect(true);

    done();
  });

  this.afterAll(function (done) {
    server.close();
    done();
  });

  describe("Message Events", function () {
    it("Clients should receive a message when the `message` event is emitted.", function (done) {
      const testMsg = "Testing";

      receiver.on("message", function (msg) {
        expect(msg).to.equal(testMsg);
        done();
      });
      sender.emit("message", testMsg);
    });
  });
});
