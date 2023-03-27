const express = require("express");

const {errorHandler, notFound} = require("./controllers/errorHandler")

const { getCategories } = require("./controllers/categories")

const app = express();


app.get("/api/categories", getCategories);

app.use(errorHandler)

// Handle non matching routes (Required to be at bottom of stack)
app.use(notFound)

module.exports = app;