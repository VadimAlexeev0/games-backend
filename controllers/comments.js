const { fetchCommentByReviewID } = require("../models");

exports.getCommentByReviewID = (req, res, next) => {
    const { review_id } = req.params;

    fetchCommentByReviewID(review_id).then((comments)=>{
        if(comments.length === 0){
            next({
                status: 404,
                msg: "404 No comments found"
            })
        }
        res.status(200).send({
            "comments": comments
        })
    })
    .catch((err)=>{
        next(err)
    })
}