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

describe("GET: /api/reviews/:review_id", ()=>{
    test("200: Respond with object of review at id", ()=>{
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({body})=>{
                const { review } = body;

                expect(review).toBeInstanceOf(Object);

                // review_id
                // title
                // review_body
                // designer
                // review_img_url
                // votes
                // category
                // owner
                // created_at
        
                expect(review).toMatchObject({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    review_body: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    votes: expect.any(Number),
                    category: expect.any(String),
                    owner: expect.any(String),
                    created_at: expect.any(String),
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