import {server} from '../server'
import supertest from 'supertest'
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const client = supertest(server)

describe("Testing the endpoints", ()=> {
    beforeAll(done => {
        mongoose.connect(process.env.MONGO_URL_TEST!)
            .then(() => {
                console.log("Connected to Mongo DB in test...")
                done()
            })
    })


it("should get Users with /users endpoint!", async()=> {
    const response = await client.get("/users")
    expect(response.status).toBe(200)
})

    afterAll(done => {
        mongoose.connection.dropDatabase().then(() => {
            return mongoose.connection.close()
        }).then(() => {
            console.log("Dropped database and closed connection")
            done()
        })
    })
})