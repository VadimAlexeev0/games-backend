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