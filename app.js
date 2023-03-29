const express = require("express");

const { customError, errorHandler, notFound } = require("./errorHandler")

const { 
    getCategories,
    getReviewByID,
    getReviews,
    getCommentByReviewID,
    postCommentByReviewID
} = require("./controllers")

const app = express();

app.use(express.json())

// Routes
app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentByReviewID);

app.post("/api/reviews/:review_id/comments", postCommentByReviewID);

//Error Handling
app.use(customError)
app.use(errorHandler)

// Handle non matching routes (Required to be at bottom of stack)
app.use(notFound)

module.exports = app;