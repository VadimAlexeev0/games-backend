const db = require("../db/connection");

exports.fetchSingleReview = (id)=>{
    return db.query(`
        SELECT *
        FROM reviews
        WHERE review_id = $1;
    `, [id]).then((review)=>{
        return review.rows[0]
   })
}