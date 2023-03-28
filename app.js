const express = require("express");

const { 
    getCategories,
    getReviewByID,
    getReviews,
    getCommentByReviewID,
    customError,
    errorHandler,
    notFound  
} = require("./controllers")

const app = express();


app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.get("/api/reviews", getReviews);

app.get("/api/reviews:review_id/comments", getCommentByReviewID);

//Error Handling
app.use(customError)
app.use(errorHandler)

// Handle non matching routes (Required to be at bottom of stack)
app.use(notFound)

module.exports = app;