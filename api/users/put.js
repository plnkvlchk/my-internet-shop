import * as user from '../../db/tables/user.js'
import * as helpers from '../../helpers/user.js'
import getResponse from '../../helpers/response'


export function updateUserById(req, res) {
    let users = user.getUsers()

    if (!helpers.isUserExists(users, req.params.userId)) {
        return res.status(400).json({response: getResponse(false, "update",
            "Element with id " + req.params.userId + " does not exist", "user")})
    }

    let currentUser = user.getUserById(req.params.userId)

    if ((!helpers.isUserLoginUnique(users, req.body.login)) && !(currentUser.login === req.body.login)) {
        return res.status(400).json({response: getResponse(false, "update",
            "Input 'LOGIN' is not unique")})
    }

    let newProperties = req.body
    if (newProperties.id) {
        delete newProperties["id"]
    }

    return res.status(200).json({response: getResponse(true),
        result: user.updateUserById(req.params.userId, newProperties)})
}



