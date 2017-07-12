import * as user from '../../db/tables/user.js'
import * as helpers from '../../helpers/user.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'

export function updateUserById(req, res) {
    let result
    let status = 400

    let users = user.getUsers()

    if (!helpers.isUserExists(users, req.params.userId)) {
        result = responseHelpers.getFailureResponse(operations.PUT, types.USER, errors.NOT_EXISTS,
            { "id": req.params.userId })
        return res.status(status).json(result)
    }

    let userToUpdate = user.getUserById(req.params.userId)

    if ((!helpers.isUserLoginUnique(users, req.body.login)) && !(userToUpdate.login === req.body.login)) {
        result = responseHelpers.getFailureResponse(operations.PUT, types.LOGIN, errors.NOT_UNIQUE,
            { "login": req.body.login })
        return res.status(status).json(result)
    }

    delete req.body["id"]
    status = 200
    result = responseHelpers.getSuccessResponse(operations.PUT, user.updateUserById(req.params.userId, req.body), types.USER)

    return res.status(status).json(result)
}
