const {fetchSingleReview, fetchReviews} = require("../models/reviews")

exports.getReviewByID = (req, res, next)=>{
    const { review_id } = req.params;

    fetchSingleReview(review_id).then((review)=>{
        // If no data returned throw error
        if(!review){
            next({
                status: 404,
                message: "404 ID Not found"
            })
        }

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