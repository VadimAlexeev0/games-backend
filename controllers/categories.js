const {fetchCategories} = require("../models")

exports.getCategories = (req,res)=>{
    fetchCategories().then((categories)=>{
        res.status(200).send({
            "categories": categories
        })
    })
}