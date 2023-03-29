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