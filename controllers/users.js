const { fetchUsers } = require('../models');

exports.getUsers = (req, res, err) => {
    fetchUsers().then((users)=> {
        res.status(200).send({ users })
    })
    .catch(err => next(err))
}