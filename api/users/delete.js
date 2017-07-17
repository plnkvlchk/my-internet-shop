import * as user from '../../db/tables/user.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import { deleteUserByIdQuery, getUserByIdQuery, deleteRelationByIdsQuery, deleteUsersProductsQuery, deleteAllUsersQuery } from '../../sql-queries'
import { oneOrNoneReturning, oneOrNone, manyOrNone } from '../../db'

export async function deleteUserById(req, res) {
    let result
    let status = 400

    const dataFromPostgres = await oneOrNoneReturning(deleteUserByIdQuery(req.params.userId))

    if(dataFromPostgres) {
        result = responseHelpers.getSuccessResponse(operations.DELETE, dataFromPostgres, types.USER)
        status = 200
    } else {
        result = responseHelpers.getFailureResponse(operations.DELETE, types.USER, errors.NOT_EXISTS, {
            "id": req.params.userId
        })
    }

    return res.status(status).json(result)
}

export async function deleteAllUsers(req, res) {
    const dataFromPostgres = manyOrNone(deleteAllUsersQuery())
    const result = responseHelpers.getSuccessResponse(operations.DELETE, dataFromPostgres, types.USERS)
    return res.status(200).json(result)
}

export async function deleteRelationByIds(req, res) {
    let result
    let status = 400

    const currentUser = await oneOrNone(getUserByIdQuery(req.params.userId))
    if (!currentUser) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.USER, errors.NOT_EXISTS, {
            "id": req.params.userId
        })
        return res.status(status).json(result)
    }

    const dataFromPostgres = await oneOrNoneReturning(deleteRelationByIdsQuery(req.params.userId, req.params.productId))
    if (!dataFromPostgres) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.RELATION, errors.NOT_EXISTS, {
            'user_id': req.params.userId,
            'product_id': req.params.productId
        })
        return res.status(status).json(result)
    }

    result = responseHelpers.getSuccessResponse(operations.DELETE_RELATION, dataFromPostgres, types.RELATION)
    status = 200
    return res.status(status).json(result)
}

export async function deleteUsersRelations(req, res) {
    let result
    let status = 400

    const currentUser = await oneOrNone(getUserByIdQuery(req.params.userId))
    if (!currentUser) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.USER, errors.NOT_EXISTS, {
            "id": req.params.userId
        })
        return res.status(status).json(result)
    }

    const dataFromPostgres = await manyOrNone(deleteUsersProductsQuery(req.params.userId))

    result = responseHelpers.getSuccessResponse(operations.DELETE_RELATION, dataFromPostgres, types.RELATIONS)
    status = 200

    return res.status(status).json(result)
}
