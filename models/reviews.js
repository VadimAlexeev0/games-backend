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

exports.fetchReviews = (category, sort_by, order) => {
    const queryValues = [];
    let queryStr = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, COUNT(comments.review_id) AS comment_count FROM reviews FULL OUTER JOIN comments ON comments.review_id = reviews.review_id`
    if (category){
        queryValues.push(category)
        queryStr += ` WHERE reviews.category = $1`
    }
    if (sort_by){
        if (!['review_id', 'title', 'category', 'designer', 'owner', 'review_img_url', 'created_at', 'votes'].includes(sort_by)){
        return Promise.reject({status: 400, msg: "Invalid sort query"})
    }
    }
    if (order) {
        if (!['ASC', 'DESC'].includes(order)){
        return Promise.reject({status: 400, msg: "Invalid order query"})
    }
}
if(sort_by && order || !sort_by && order || sort_by && !order || !sort_by && !order){
    queryStr += ` GROUP BY reviews.review_id ORDER BY reviews.`
}
    if (sort_by && order){
        queryStr += `${sort_by} ${order};`
    }
    if (sort_by && !order){
        queryStr += `${sort_by} DESC;`
    }
    if (!sort_by && order){
        queryStr += `created_at ${order};`
    }
    if (!sort_by && !order){
        queryStr += `created_at DESC;`
    }
    return db.query(queryStr, queryValues)
    .then((result) => {
        return result.rows
    })
}

exports.checkIfCategoryExists = (category) => {
    return db.query(`SELECT * FROM categories WHERE slug = $1;`, [category])
    .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({status: 404, msg: "Category not found"})
        }
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