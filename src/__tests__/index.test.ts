import { server } from "../server";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'
import UserModel from '../services/users/schema'

dotenv.config();

const client = supertest(server);

describe("Testing the endpoints", () => {
  beforeAll((done) => {
    mongoose.connect(process.env.MONGO_URL_TEST!).then(() => {
      console.log("Connected to Mongo DB in test...");
      done();
    });
  });

  afterAll((done) => {
    mongoose.connection.close().then(() => {
      done();
    });
  });
  it("should work", () => {
    expect(true).toBe(true);
  });

  const UserRegistration = {
    email: "ali@gmail.com",
    password: "1234",
  };
  let userId:string;
  it("should register the Users with /register endpoint!", async () => {
    const response = await client.post("/user/register").send(UserRegistration);
    expect(response.status).toBe(201);
    userId = response.body._id
  });


  let logInToken = '';
  it("should log the Users with /login endpoint!", async () => {
    const response = await client.post("/user/login").send(UserRegistration);
    expect(response.status).toBe(201);
    // logInToken = response.body.Data.token
  });


  it("should get accomadation /accomadation ", async () => {
    const response = await client.get("/accomadation");
    expect(response.status).toBe(200);
  });


//   it("should generate JWT token for logged in users!", async () => {
//     return UserModel.create(UserRegistration).then((user)=> {
//         return client.get(`/user/${userId}`)
//     })
//   });



//   it("should get /user/me/accomadation endpoint!", async () => {
//     const response = await client.get("/user/me/accomodation").set('Authorization', `Bearer + ${logInToken}`);;
//     expect(response.status).toBe(200);
//   });



  
});
