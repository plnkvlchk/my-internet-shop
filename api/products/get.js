import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import { manyOrNone, oneOrNone } from '../../db'
import { getAllProductsQuery, getProductByIdQuery, getProductsUsersQuery } from '../../sql-queries'

export async function getAll(req, res) {
    const dataFromPostgres = await manyOrNone(getAllProductsQuery())
    const result = responseHelpers.getSuccessResponse(operations.GET, dataFromPostgres, types.PRODUCTS)
    return res.status(200).json(result)
}

export async function getProductById(req, res) {
    let status = 400
    let result

    console.log(getProductByIdQuery(req.params.productId))
    const dataFromPostgres = await oneOrNone(getProductByIdQuery(req.params.productId))
    console.log(dataFromPostgres)


    if (dataFromPostgres) {
        console.log('g')
        result = responseHelpers.getSuccessResponse(operations.GET, dataFromPostgres, types.PRODUCT)
        status = 200
    } else {
        result = responseHelpers.getFailureResponse(operations.GET, types.PRODUCT, errors.NOT_EXISTS, {
            "id": req.params.productId
        })
    }

    return res.status(status).json(result)
}

export async function getProductsUsers(req, res) {
    let status = 400
    let result

    const currentProduct = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!currentProduct) {
        result = responseHelpers.getFailureResponse(operations.GET_RELATION, types.PRODUCT, errors.NOT_EXISTS,
            {"id": req.params.productId})
        return res.status(status).json(result)
    }

    const dataFromPostgres = await manyOrNone(getProductsUsersQuery(req.params.productId))

    status = 200
    result = responseHelpers.getSuccessResponse(operations.GET_RELATION, dataFromPostgres, types.RELATIONS)

    return res.status(status).json(result)
}
