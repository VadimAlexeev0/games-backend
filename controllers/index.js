const categories = require('./categories');
const reviews = require("./reviews");
const comments = require("./comments");
const users = require("./users");

module.exports = {
    ...categories,
    ...reviews,
    ...comments,
    ...users
}