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
    test("200: Response is an array", ()=>{
        return request(app)
            .get("/api/categories")
            .expect(200)
            .then(({body})=>{
                const { categories } = body;

                expect(categories).toBeInstanceOf(Array);
            })
    })
})