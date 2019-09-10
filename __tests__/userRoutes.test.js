process.env.NODE_ENV = "test";
const request = require("supertest");
const jwt = require("jsonwebtoken");

const app = require("../app");
const db = require("../db");
const User = require("../models/user");

let user1;
let token;

describe("Auth Routes Test", function() {
  beforeEach(async function(done) {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");

    
    
    let u1 = {
        username: "test1",
        password: "password",
        first_name: "Test1",
        last_name: "Testy1",
        phone: "+14155550000"
    };
    
    let authReq = request(app)
      .post('/auth/register')
      .send(u1)

    user1 = u1;

    let response = await request(app)
      .post("auth/login")
      .send({ username: u1.username, password: u1.password })
      .end(function(err, res){
          token = res.body.token;
          done()
      })

    //done();
  });

  describe("GET /users/", function() {
    test("can get all users", async function() {
      console.log("second");
      let response = await request(app).get("/users/")
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        users: [
          {
            username: user1.username,
            first_name: user1.first_name,
            last_name: user1.last_name,
            phone: user1.phone
          }
        ]
      });
    });
    test("can not get all the users", async function(){
      let response = await request(app).get("/users/");
      expect(response.statusCode).toEqual(401);
    })




  });
});

afterAll(async function(done) {
  await db.end();
  done();
});
