const { fetchCommentByReviewID, newComment } = require("../models");

exports.getCommentByReviewID = (req, res, next) => {
    const { review_id } = req.params;

    fetchCommentByReviewID(review_id).then((comments)=>{
        res.status(200).send({
            "comments": comments
        })
    })
    .catch((err)=>{
        next(err)
    })
}

exports.postCommentByReviewID = (req, res, next) => {
    const { review_id } = req.params;
    
    const { username, body } = req.body;
    if(!username || !body){
        console.log("Missing data")
        next({
            status: 400,
            msg: "400 Request Body Malformed"
        })
    }
    newComment(review_id, username, body).then((comment)=>{
        res.status(201).send({
            "newComment": comment
        })
    })
    .catch(err => next(err));

}