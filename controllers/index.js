const categories = require('./categories');
const reviews = require("./reviews");
const comments = require("./comments");

module.exports = {
    ...categories,
    ...reviews,
    ...comments
}