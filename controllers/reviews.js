const {fetchSingleReview, fetchReviews, updateVotes, checkIfCategoryExists} = require("../models")

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
    const { category, sort_by, order } = req.query;

  if (category) {
    checkIfCategoryExists(category).then(() => {
      return fetchReviews(category, sort_by, order)
        .then((reviews) => {
          if (reviews.length !== 0) {
            res.status(200).send({ reviews: reviews });
          }
          if (reviews.length === 0) {
            res.status(200).send({ msg: "No reviews for selected category" });
          }
        })
        ;
    }).catch((err) => {
      next(err);
    });
  } else {
    return fetchReviews(category, sort_by, order)
      .then((reviews) => {
        res.status(200).send({ reviews: reviews });
      })
      .catch((err) => {
        next(err);
      });
  } 
}

exports.patchReviewByID = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    
    if(!inc_votes) {
        next({
            status: 400,
            msg: "400 Missing inc_votes key"
        })
    } 
    updateVotes(review_id, inc_votes).then((updated)=>{
        res.status(200).send({
            review: updated
        })
    })
    .catch(err => next(err))
}