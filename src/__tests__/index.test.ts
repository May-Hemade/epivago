import { server } from "../server";
import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

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

  it("should register the Users with /register endpoint!", async () => {
    const response = await client.post("/user/register").send(UserRegistration);
    expect(response.status).toBe(201);
  });

  it("should log the Users with /login endpoint!", async () => {
    const response = await client.post("/user/login").send(UserRegistration);
    expect(response.status).toBe(201);
  });


  
});
