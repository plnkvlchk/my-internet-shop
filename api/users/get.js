import * as user from '../../db/tables/user.js'
import * as catalog from '../../db/tables/catalog.js'
import * as helpers from '../../helpers/user.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'

export function getAll(req, res) {
    const result = responseHelpers.getSuccessResponse(operations.GET, user.getUsers(), types.USERS)
    return res.status(200).json(result)
}

export function getUserById(req, res) {
    let result
    let status = 400

    const users = user.getUsers()

    if (helpers.isUserExists(users, req.params.userId)) {
        status = 200
        result = responseHelpers.getSuccessResponse(operations.GET, user.getUserById(req.params.userId))
    } else {
        result = responseHelpers.getFailureResponse(operations.GET, types.USER, errors.NOT_EXISTS,
            { "id": req.params.userId })
    }

    return res.status(status).json(result)
}

export function getUsersProducts(req, res) {
    let result
    let status = 400

    if (!helpers.isUserExists(user.getUsers(), req.params.userId)) {
        result = responseHelpers.getFailureResponse(operations.GET_RELATION, types.USER, errors.NOT_EXISTS,
            { "id": req.params.userId})
    } else {
        status = 200
        result = responseHelpers.getSuccessResponse(operations.GET_RELATION, catalog.getUsersProducts(req.params.userId),
            types.RELATIONS)
    }

    return res.status(status).json(result)
}
