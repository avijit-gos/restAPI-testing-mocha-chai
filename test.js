/** @format */

const chai = require("chai");
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require("chai-http");
const { afterEach } = require("mocha");
const server = require("./index");
const User = require("./Server/Model/UserModel");

chai.use(chaiHttp);

const user = {
  name: "Peter Borrow",
  username: "peter_123",
  email: "peter_123@test.com",
  password: "123",
};
const user_login = {
  logUser: "peter_123@test.com",
  password: "123",
};

// // *** cleanup database for before every test case run
// beforeEach((done) => {
//   User.deleteMany({}, (err) => {
//     // console.log("Before delete");
//   });
//   done();
// });

// // *** cleanup database for after every test case run
// after((done) => {
//   User.deleteMany({}, (err) => {
//     // console.log("After delete");
//   });
//   done();
// });

describe("User Registration", () => {
  // *** Before each test function call this before each method called to clear our DB
  beforeEach((done) => {
    User.deleteMany({}, (err) => {
      // console.log("Before delete");
    });
    done();
  });

  afterEach((done) => {
    User.deleteMany({}, (err) => {
      // console.log("Before delete");
    });
    done();
  });

  // afterEach((done) => {
  //   User.deleteMany({}, (err) => {
  //     console.log("after delete");
  //   });
  //   done();
  // });

  // Registration test
  it("/register", (done) => {
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        res.should.have.status(201);
        res.body.should.have.an("object");
        done();
      });
  });

  // Login test
  it("/login", (done) => {
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        res.should.have.status(201);
        res.body.should.have.an("object");
        chai
          .request(server)
          .post("/api/user/login")
          .send(user_login)
          .end((err, res) => {
            // console.log(res.body);
            res.should.have.status(200);
            res.body.should.have.an("object");
            res.body.should.have.a.property("user");
            res.body.should.have.a.property("token");
            res.body.user.should.have.a.property("_id");
            done();
          });
      });
  });

  // Fetch user data
  it("/fetch/user/:id", (done) => {
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        res.should.have.status(201);
        res.body.should.have.an("object");
        chai
          .request(server)
          .post("/api/user/login")
          .send(user_login)
          .end((err, res) => {
            // console.log(res.body);
            res.should.have.status(200);
            res.body.should.have.an("object");
            res.body.should.have.a.property("user");
            res.body.should.have.a.property("token");
            res.body.user.should.have.a.property("_id");

            chai
              .request(server)
              .get(`/api/user/${res.body.user._id}`)
              .set({ "x-access-token": res.body.token })
              .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(200);
                res.body.should.have.an("object");
                res.body.should.have.a.property("_id");
                res.body.should.have.a.property("name");
                res.body.name.should.a("string");
                res.body.should.have.a.property("username");
                res.body.should.have.a.property("email");
                res.body.should.have.not.a.property("password");
                done();
              });
          });
      });
  });

  // Update user
  it("/update/user/:id", (done) => {
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        res.should.have.status(201);
        res.body.should.have.an("object");
        chai
          .request(server)
          .post("/api/user/login")
          .send(user_login)
          .end((err, res) => {
            // console.log(res.body);
            res.should.have.status(200);
            res.body.should.have.an("object");
            res.body.should.have.a.property("user");
            res.body.should.have.a.property("token");
            res.body.user.should.have.a.property("_id");

            chai
              .request(server)
              .put(`/api/user/`)
              .set({ "x-access-token": res.body.token })
              .send({
                name: "Peter Goswami",
                username: "avijit_123",
                email: "avijit_123@test.com",
                password: "123",
              })
              .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(200);
                res.body.should.have.an("object");
                res.body.user.should.have.a.property("_id");
                res.body.user.should.have.a.property("name");
                res.body.user.name.should.a("string");
                res.body.user.should.have.a.property("username");
                res.body.user.should.have.a.property("email");
                done();
              });
          });
      });
  });

  // Delete user
  it("/delete/user/:id", (done) => {
    chai
      .request(server)
      .post("/api/user/register")
      .send(user)
      .end((err, res) => {
        // console.log(res.body);
        res.should.have.status(201);
        res.body.should.have.an("object");
        chai
          .request(server)
          .post("/api/user/login")
          .send(user_login)
          .end((err, res) => {
            // console.log(res.body);
            res.should.have.status(200);
            res.body.should.have.an("object");
            res.body.should.have.a.property("user");
            res.body.should.have.a.property("token");
            res.body.user.should.have.a.property("_id");

            chai
              .request(server)
              .delete(`/api/user/`)
              .set({ "x-access-token": res.body.token })
              .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(200);
                res.body.should.have.an("object");
                done();
              });
          });
      });
  });
});
