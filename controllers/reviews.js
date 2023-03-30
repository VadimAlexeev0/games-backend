const {fetchSingleReview, fetchReviews, updateVotes} = require("../models")

exports.getReviewByID = (req, res, next)=>{
    const { review_id } = req.params;

    fetchSingleReview(review_id).then((review)=>{
        // If no data returned throw error
        res.status(200).send({
            "review": review
        })
    })
    .catch((err)=>{
        next(err)
    })
}

exports.getReviews = (req, res, next) => {
    fetchReviews().then((reviews)=>{
        res.status(200).send({
            "reviews": reviews
        })
    })
    .catch((err)=>{
        next(err)
    })
}

exports.patchReviewByID = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;

    if(!inc_votes) {
        next({
            status: 400,
            msg: "400 Missing inc_votes key"
        })
    } else {
        updateVotes(review_id, inc_votes).then((updated)=>{
            res.status(200).send({
                review: updated
            })
        })
        .catch(err => next(err))
    }
}