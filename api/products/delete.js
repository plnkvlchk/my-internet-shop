import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import { oneOrNoneReturning, manyOrNone, oneOrNone } from '../../db'
import { deleteProductByIdQuery, deleteAllProductsQuery, getProductByIdQuery, deleteRelationByIdsQuery, deleteProductsUsersQuery } from '../../sql-queries/'

export async function deleteProductById(req, res) {
    let status = 400
    let result

    const dataFromPostgres = await oneOrNoneReturning(deleteProductByIdQuery(req.params.productId))

    if (dataFromPostgres) {
        result = responseHelpers.getSuccessResponse(operations.DELETE, dataFromPostgres, types.PRODUCT)
        status = 200
    } else {
        result = responseHelpers.getFailureResponse(operations.DELETE, types.PRODUCT, errors.NOT_EXISTS, {
            "id": req.params.productId
        })
    }

    return res.status(status).json(result)
}

export async function deleteAllProducts(req, res) {
    const dataFromPostgres = await manyOrNone(deleteAllProductsQuery())
    const result = responseHelpers.getSuccessResponse(operations.DELETE, dataFromPostgres, types.PRODUCTS)
    return res.status(200).json(result)
}

export async function deleteRelationByIds(req, res) {
    let status = 400
    let result

    const currentProduct = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!currentProduct) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.PRODUCT, errors.NOT_EXISTS, {
            "id": req.params.productId
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

    status = 200
    result = responseHelpers.getSuccessResponse(operations.DELETE_RELATION, dataFromPostgres, types.RELATION)

    return res.status(status).json(result)
}

export async function deleteProductsRelations(req, res) {
    let status = 400
    let result

    const currentProduct = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!currentProduct) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.PRODUCT, errors.NOT_EXISTS, {
            "id": req.params.productId
        })
        return res.status(status).json(result)
    }

    const dataFromPostgres = await manyOrNone(deleteProductsUsersQuery(req.params.productId))

    status = 200
    result = responseHelpers.getSuccessResponse(operations.DELETE_RELATION, dataFromPostgres, types.RELATIONS)

    return res.status(status).json(result)
}
