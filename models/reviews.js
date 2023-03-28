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

exports.fetchReviews = () => {
    return db.query(`
        SELECT 
            title,
            owner,
            reviews.review_id,
            category,
            review_img_url,
            reviews.created_at,
            MAX(COALESCE(comments.votes, 0)) AS votes,
            designer,
            CAST(COUNT(comments.review_id) AS INT) AS comment_count
        FROM reviews
        LEFT JOIN comments
        ON comments.review_id = reviews.review_id
        GROUP BY 
            title,
            owner,
            reviews.review_id,
            category,
            review_img_url,
            reviews.created_at,
            comments.votes,
            designer
    `).then((data)=>{
        return data.rows;
    })
}