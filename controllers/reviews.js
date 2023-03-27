const {fetchSingleReview} = require("../models/reviews")

exports.getReviewByID = (req, res)=>{
    const { review_id } = req.params;
    console.log(review_id)
    fetchSingleReview(review_id).then((review)=>{
        res.status(200).send({
            "review": review
        })
    })
}