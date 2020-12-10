"use strict";

const chai = require("chai");
const expect = chai.expect;
const server = require("../dist/server");
const io = require("socket.io-client");

let client;

describe("Connections", function () {
  this.timeout(2000);

  this.beforeAll(function (done) {
    server.start(true);

    done();
  });

  this.afterEach(function (done) {
    client.disconnect(true);

    done();
  });

  this.afterAll(function (done) {
    server.close();
    done();
  });

  it("Clients should be notified when a room doesn't exist", function (done) {
    client = io("http://localhost:3000", {
      path: "/chat",
      query: { id: "Jay", room: "Test" },
    });

    client.on("roomNotFound", function (msg) {
      expect(msg).to.contain("does not exist");
      done();
    });
  });

  it("Clients should be able to join the 'general' room", function (done) {
    client = io("http://localhost:3000", {
      path: "/chat",
      query: { id: "Jay", room: "General" },
    });

    client.on("joinedRoom", function (msg) {
      expect(msg).to.haveOwnProperty("content");
      expect(msg).to.haveOwnProperty("sender");
      expect(msg.content).to.contain("You have joined room:");
      done();
    });
  });
});
