const { fetchCommentByReviewID, newComment, usernameExists } = require("../models");

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
        next({
            status: 400,
            msg: "400 Request Body Malformed"
        })
    }
    usernameExists(username).then((exists)=>{
        console.log(exists)
        if(exists){
            newComment(review_id, username, body).then((comment)=>{
                res.status(201).send({
                    "newComment": comment
                })
            })
            .catch(err => next(err));
        } else{
            next({
                status: 404,
                msg: "404 Username does not exist"
            })
        }
    })
    
}