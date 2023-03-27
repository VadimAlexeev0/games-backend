const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() =>
  seed(testData)
);

afterAll(() => db.end());

describe("GET: /api/categories", ()=>{
    test("200: Respond with an array containing objects with correct formatting", ()=>{
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({body})=>{
                const { categories } = body;

                expect(categories).toBeInstanceOf(Array);
                expect(categories.length).toBe(4);

                categories.forEach((category) => {
                    expect(category).toMatchObject({
                        slug: expect.any(String),
                        description: expect.any(String),
                    });
                }); 
            })
    })
})

describe("Error Handling", ()=>{
    test("404: When given non-existent path respond with 404 error", ()=>{
        return request(app)
            .get("/not-a-path")
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("404 path not found")
            })
    })
})