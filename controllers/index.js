const categories = require('./categories');
const reviews = require("./reviews");
const comments = require("./comments");
const errorHandler = require("./errorHandler");

module.exports = {
    ...categories,
    ...reviews,
    ...comments,
    ...errorHandler
}