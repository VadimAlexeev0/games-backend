const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() =>
  seed(testData)
);

afterAll(() => db.end());

test("404: When given non-existent path respond with 404 error", ()=>{
    return request(app)
        .get("/not-a-path")
        .expect(404)
        .then(({body})=>{
            expect(body.msg).toBe("404 path not found")
        })
})

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
                
                expect(comments).toEqual([]);
            })
    })
    test("400: When given non numerical param", ()=>{
        return request(app)
            .get("/api/reviews/random/comments")
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("400 Invalid input")
            })
    })
})

describe("POST: /api/reviews/:review_id/comments", ()=>{
    test("201: Respond with new comment", ()=>{
        const requestBody = {
            username: "dav3rid",
            body: "Very positive review"
        }

        return request(app)
            .post("/api/reviews/1/comments")
            .send(requestBody)
            .expect(201)
            .then(({body})=>{
                const { newComment } = body;
                
                expect(newComment).toMatchObject({
                    author: requestBody.username,
                    body: requestBody.body,
                    comment_id: expect.any(Number),
                    created_at: expect.any(String),
                    review_id: expect.any(Number),
                    votes: expect.any(Number)
                })
            })
    })
    test("400: When given non numerical review_id", ()=>{
        return request(app)
            .post("/api/reviews/NaN/comments")
            .send({username: "dav3rid", body: "test"})
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("400 Invalid input")
            })
    })
    test("404: When reviewID invalid", ()=>{
        return request(app)
            .post("/api/reviews/9999/comments")
            .send({username: "dav3rid", body: "test"})
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("404 Invalid ID")
            })
    })
    test("400: When missing body in request", ()=>{
        return request(app)
            .post("/api/reviews/5/comments")
            .send({ username: "dav3rid"})
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("400 Request Body Malformed")
            })
    })
    test("400: When missing username in request", ()=>{
        return request(app)
            .post("/api/reviews/5/comments")
            .send({ body: "test"})
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("400 Request Body Malformed")
            })
    })
    test("404: When username is non-existent", ()=>{
        return request(app)
            .post("/api/reviews/1/comments")
            .send({
                username: "newUser",
                body: "Very positive review"
            })
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("404 Username does not exist")
            })
    })
})

describe("PATCH: /api/reviews/:review_id", ()=>{
    test("200: Increase votes by provided int", ()=>{
        return request(app)
            .patch("/api/reviews/2")
            .send({
                inc_votes: 1
            })
            .expect(200)
            .then(({body})=>{
                const { review } = body

                expect(review.votes).toBe(6)
            })
    })
    test("200: Decrease votes by provided int", ()=>{
        return request(app)
            .patch("/api/reviews/2")
            .send({
                inc_votes: -3
            })
            .expect(200)
            .then(({body})=>{
                const { review } = body
                expect(review.votes).toBe(2)
            })
    })
    test("400: When missing inc_votes key", ()=>{
        return request(app)
            .patch("/api/reviews/2")
            .send({})
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("400 Missing inc_votes key")
            })
    })

    test("400: When inc_votes not integer", ()=>{
        return request(app)
            .patch("/api/reviews/2")
            .send({
                inc_votes: "not a int"
            })
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe("400 Invalid input")
            })
    })

    test("404: review_id not valid", ()=>{
        return request(app)
            .patch("/api/reviews/9999")
            .send({
                inc_votes: 10
            })
            .expect(404)
            .then(({body})=>{
                expect(body.msg).toBe("404 Review ID Not found")
            })
    })
})

describe("GET: /api/users", ()=>{
    test("200: Return array of user object", ()=>{
        return request(app)
            .get("/api/users")
            .expect(200)
            .then(({body})=>{
                const { users } = body;

                expect(users).toBeInstanceOf(Array);
                expect(users.length).toBe(4);
            })
    })
})