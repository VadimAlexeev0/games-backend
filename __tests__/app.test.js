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

describe("GET: /api/reviews/:review_id", () => {
    test("200: Respond with object of review at id", ()=>{
        return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({body})=>{
                const { review } = body;
    
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

describe("GET: /api/reviews",()=>{
    test("200: Respond with array containing reviews", ()=>{
        return request(app)
            .get("/api/reviews")
            .expect(200)
            .then(({body})=>{
                const { reviews } = body;
                

                expect(reviews).toBeInstanceOf(Array);
                expect(reviews.length).toBe(15);

                reviews.forEach((review) => {
                    expect(review).toMatchObject({
                        review_id: expect.any(Number),
                        title: expect.any(String),
                        designer: expect.any(String),
                        review_img_url: expect.any(String),
                        votes: expect.any(Number),
                        category: expect.any(String),
                        owner: expect.any(String),
                        created_at: expect.any(String),
                        comment_count: expect.any(Number)
                    });
                })

                expect(reviews).toBeSortedBy('created_at', { descending: true });
            })
    })
})

describe("GET: /api/reviews/:review_id/comments", ()=>{
    test("200: Respond with array of comments for given ID", ()=>{
        return request(app)
            .get("/api/reviews/3/comments")
            .expect(200)
            .then(({body})=>{
                const { comments } = body;

                expect(comments).toBeInstanceOf(Array);
                expect(comments.length).toBe(3);

                comments.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        review_id: expect.any(Number)
                    })
                })
                // Check sort
                expect(comments).toBeSortedBy("created_at", { descending: true})
            })
    })
    test("200: Return empty array when ID valid but non-existent ", ()=>{
        return request(app)
            .get("/api/reviews/20/comments")
            .expect(200)
            .then(({body})=>{
                const { comments } = body;
                
                expect(comments).toEqual([]);
            })
    })
    test("200: Return Empty array When no comments on review", ()=>{
        return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then(({body})=>{
                const { comments } = body;
                console.log(comments)
                expect(comments).toEqual([]);
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
    describe("/api/reviews/:review_id", ()=>{
        test("400: When given non numerical param", ()=>{
            return request(app)
                .get("/api/reviews/not_a_number")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe("400 Invalid input")
                })
        })

        test("404: When id valid but non-existent", ()=>{
            return request(app)
                .get("/api/reviews/200")
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe("404 ID Not found")
                })
        })
    })

    describe("/api/reviews/:review_id/comments", ()=>{
        test("400: When given non numerical param", ()=>{
            return request(app)
                .get("/api/reviews/random/comments")
                .expect(400)
                .then(({body})=>{
                    expect(body.msg).toBe("400 Invalid input")
                })
        })
    })
})