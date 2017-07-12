import * as user from '../../db/tables/user.js'
import * as catalog from '../../db/tables/catalog.js'
import * as helpers from '../../helpers/user.js'
import * as catalogHelpers from '../../helpers/catalog'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import _ from 'lodash'

export function deleteUserById(req, res) {
    let result
    let status = 400

    if (helpers.isUserExists(user.getUsers(), req.params.userId)) {
        status = 200
        result = responseHelpers.getSuccessResponse(operations.DELETE, user.deleteUserById(req.params.userId), types.USER)
    } else {
        result = responseHelpers.getFailureResponse(operations.DELETE, types.USER, errors.NOT_EXISTS,
            {"id": req.params.userId})
    }

    return res.status(status).json(result)
}

export function deleteAllUsers(req, res) {
    const result = responseHelpers.getSuccessResponse(operations.DELETE, user.deleteAllUsers(), types.USERS)
    return res.status(200).json(result)
}

export function deleteRelationByIds(req, res) {
    let result
    let status = 400

    if (!helpers.isUserExists(user.getUsers(), req.params.userId)) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.USER, errors.NOT_EXISTS,
            {"id": req.params.userId})
        return res.status(status).json(result)
    }

    if (!catalogHelpers.isRelationExists(catalog.getCatalog(), req.params.userId, req.params.productId)) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.RELATION, errors.NOT_EXISTS,
            {"userId": req.params.userId, "productId": req.params.productId})
        return res.status(status).json(result)
    }

    status = 200
    result = responseHelpers.getSuccessResponse(operations.DELETE_RELATION,
        catalog.deleteRelation(req.params.userId, req.params.productId), types.RELATION)

    return res.status(status).json(result)
}

export function deleteUsersRelations(req, res) {
    let result
    let status = 400

    if (!helpers.isUserExists(user.getUsers(), req.params.userId)) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.USER, errors.NOT_EXISTS,
            {"id": req.params.userId})
        return res.status(status).json(result)
    }

    status = 200
    const deleted = _.map(catalog.getUsersProducts(req.params.userId), (item) => catalog.deleteRelation(req.params.userId, item) )
    result = responseHelpers.getSuccessResponse(operations.DELETE_RELATION, deleted, types.RELATIONS)

    return res.status(status).json(result)
}
