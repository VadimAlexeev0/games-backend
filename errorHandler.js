exports.customError = (err, req, res, next)=>{
    if(err.status && err.msg){
        res.status(err.status).send({
            msg: err.msg
        });
    }else{
        next(err);
    }
}

exports.errorHandler = (err, req, res, next)=>{
    //console.log("Error: ", err)

    // PSQL errors
    if(err.code === "22P02"){
        res.status(400).send({msg: "400 Invalid input"})
    } else if(err.code === "23503"){
        res.status(404).send({msg: "404 Invalid ID"})
    } else{
        res.status(500).send({msg: "Generic error"})
    }
}

exports.notFound = (req, res, next)=>{
    res.status(404).send({msg: "404 path not found"})
}