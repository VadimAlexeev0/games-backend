const express = require("express");

const {customError, errorHandler, notFound} = require("./controllers/errorHandler")

const { getCategories } = require("./controllers/categories")

const { getReviewByID, getReviews } = require("./controllers/reviews")

const app = express();


app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);

app.get("/api/reviews", getReviews);

//Error Handling
app.use(customError)
app.use(errorHandler)

// Handle non matching routes (Required to be at bottom of stack)
app.use(notFound)

module.exports = app;