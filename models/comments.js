const db = require("../db/connection");

exports.fetchCommentByReviewID = (reviewID) => {
    return db.query(`
        SELECT *
        FROM comments
        WHERE review_id = $1
        ORDER BY created_at DESC
    `, [reviewID]).then((data)=>{
        return data.rows;
    })
}

exports.newComment = (id, author, body) => {
    return db.query(`
        INSERT INTO comments
        (review_id, author, body)
        VALUES($1, $2, $3)
        RETURNING *
    `, [id, author, body]).then((data)=>{
        return data.rows[0];
    })
}

exports.usernameExists = (findUsername) => {
    return db.query(`
        SELECT username
        FROM users
    `).then(({rows}) => {
        const exists = rows.find(({ username }) => username === findUsername);
        return exists;
    })
}

exports.checkCommentExists = (commentID) => {
    return db.query(`
        SELECT *
        FROM comments
        WHERE comment_id = $1
    `, [commentID]).then((result) => {
        if(result.rowCount === 0){
            return Promise.reject({
                status: 404,
                msg: "404 Comment ID not found"
            })
        }
    })
}

exports.deleteComment = (commentID) => {
    return db.query(`
        SELECT 
    `)
} 