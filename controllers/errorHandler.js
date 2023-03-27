exports.errorHandler = (err, req, res, next)=>{
    // TODO actually handle errors
    res.status(500).send({msg: "Generic error"})
}

exports.notFound = (req, res, next)=>{
    res.status(404).send({msg: "404 path not found"})
}