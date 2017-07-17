import * as responseHelpers from '../../helpers/response'
import { types, operations, errors } from '../constants'
import { manyOrNone, oneOrNone } from '../../db'
import { getAllUsersQuery, getUserByIdQuery, getUsersProductsQuery } from '../../sql-queries'

export async function getAll(req, res) {
    const dataFromPostgres = await manyOrNone(getAllUsersQuery())
    const result = responseHelpers.getSuccessResponse(operations.GET, dataFromPostgres, types.USERS)
    return res.status(200).json(result)
}

export async function getUserById(req, res) {
    let result
    let status = 400

    const dataFromPostgres = await oneOrNone(getUserByIdQuery(req.params.userId))

    if (dataFromPostgres) {
        result = responseHelpers.getSuccessResponse(operations.GET, dataFromPostgres, types.USER)
        status = 200
    } else {
        result = responseHelpers.getFailureResponse(operations.GET, types.USER, errors.NOT_EXISTS, {
            "id": req.params.userId
        })
    }

    return res.status(status).json(result)
}

export async function getUsersProducts(req, res) {
    let result
    let status = 400

    const currentUser = await oneOrNone(getUserByIdQuery(req.params.userId))
    if (!currentUser) {
        result = responseHelpers.getFailureResponse(operations.GET_RELATION, types.USER, errors.NOT_EXISTS, {
            "id": req.params.userId
        })
        return res.status(status).json(result)
    }

    const dataFromPostgres = await manyOrNone(getUsersProductsQuery(req.params.userId))
    result = responseHelpers.getSuccessResponse(operations.GET_RELATION, dataFromPostgres, types.RELATIONS)
    status = 200

    return res.status(status).json(result)
}
