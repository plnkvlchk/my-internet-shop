import * as user from '../../db/tables/user.js'
import * as catalog from '../../db/tables/catalog.js'
import * as helpers from '../../helpers/user.js'
import getResponse from '../../helpers/response'

export function getAll(req, res) {
    return res.status(200).json({response: getResponse(true), result: user.getUsers()})
}


export function getUserById(req, res) {
    const users = user.getUsers()
    if (helpers.isUserExists(users, req.params.userId)) {
        return res.status(200).json({response: getResponse(true), result: user.getUserById(req.params.userId)})
    } else {
        return res.status(400).json({response: getResponse(false, "get",
            "Element with id " + req.params.userId + " does not exist", "user")})
    }
}

export function getUserProducts(req, res) {
    if (!helpers.isUserExists(user.getUsers(), req.params.userId)) {
        return res.status(400).json({response: getResponse(false, "get",
            "Element does not exist", "user", req.params.userId)})
    }
    return res.status(200).json({response: getResponse(true),
        result: catalog.getUserProducts(user.getUserById(req.params.userId))})
}

