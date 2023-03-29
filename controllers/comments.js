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

exports.postCommentByReviewID = (req, res) => {
    const { review_id } = req.params;
    
    const { username, body } = req.body;
    if(!username || !body){
        console.log("Missing data")
    }
    newComment(review_id, username, body).then((comment)=>{
        res.status(201).send({
            "newComment": comment
        })
    })

}