const db = require("../db/connection");

exports.fetchSingleReview = (id)=>{
    return db.query(`
        SELECT *
        FROM reviews
        WHERE review_id = $1;
    `, [id]).then((review)=>{
        if(!review.rows[0]){
            return Promise.reject({
                status: 404,
                msg: "404 ID Not found"
            })
        }
        return review.rows[0]
   })
}

exports.fetchReviews = (order, sort, category) => {
    // const queryString = `
    //     SELECT
    //         reviews.title,
    //         reviews.owner,
    //         reviews.review_id,
    //         reviews.category,
    //         reviews.review_img_url,
    //         reviews.created_at,
    //         reviews.designer,
    //         reviews.votes,
    //         CAST(COUNT(comments.review_id) AS INT) AS comment_count
    //     FROM reviews
    //     FULL OUTER JOIN comments
    //     ON comments.review_id = reviews.review_id
    // ` 

    // const queryArray = []
    
    // // Category insertion here

    // queryString += `GROUP BY reviews.review_id`



    // if(order === "asc" || order === "desc"){
    //     console.log("Correct string")
    //     //queryString += `ORDER BY ${sort} ${order}`
    // } else{
    //     console.log("WRong")
    //     return Promise.reject({
    //         status: 400,
    //         msg: "400 Invalid order query"
    //     })
    // }

    // return db.query(queryString, queryArray).then((data) => {
    //     console.log(data);
    //     return data.rows;
    // })

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
        ORDER BY reviews.created_at DESC
    `).then((data)=>{
        return data.rows;
    })
}
exports.updateVotes = (reviewID, increaseVote) => {
    return db.query(`
        UPDATE reviews
            SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *
    `, [increaseVote, reviewID]).then((data)=>{
        if(data.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: "404 Review ID Not found"
            })
        }
        return data.rows[0]
    })
}