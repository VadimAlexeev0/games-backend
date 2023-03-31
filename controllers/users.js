const { fetchUsers } = require('../models/users');

exports.getUsers = (req, res, err) => {
    fetchUsers().then((users)=> {
        res.status(200).send({ users })
    })
    .catch(err => next(err))
}