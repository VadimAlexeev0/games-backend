const express = require("express");
const { getCategories } = require("./controllers/categories")

const app = express();


app.get("/api/categories", getCategories);

module.exports = app;