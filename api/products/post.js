import Product from '../../db/models/product.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import _ from 'lodash'
import { getProductByIdQuery, addProductQuery, addProductsUsersQuery, getProductsUsersQuery } from '../../sql-queries/'
import { getUsersIdsQuery } from '../../sql-queries/helpers'
import { oneOrNone, manyOrNone } from '../../db'

export async function addProduct(req, res) {
    let status = 400
    let result

    let newProduct
    try {
        newProduct = new Product(req.body)
    } catch(err) {
        result = responseHelpers.getFailureResponse(operations.POST, err.message, errors.REQUIRED)
        return res.status(status).json(result)
    }

    if(newProduct.id) {
        const similarProduct = await oneOrNone(getProductByIdQuery(newProduct.id))
        if (similarProduct) {
            result = responseHelpers.getFailureResponse(operations.POST, types.ID, errors.NOT_UNIQUE, {
                'id': newProduct.id
            })
            return res.status(status).json(result)
        }
    }

    const dataFromPostgres = await oneOrNone(addProductQuery(newProduct))
    result = responseHelpers.getSuccessResponse(operations.POST, dataFromPostgres, types.PRODUCT)
    status = 200
    return res.status(status).json(result)
}

export async function addProductsUsers(req, res) {
    let status = 400
    let result

    const currentProduct = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!currentProduct) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.PRODUCT, errors.NOT_EXISTS, {
            "id": req.params.productId
        })
        return res.status(status).json(result)
    }

    if(!req.body.usersIds || _.isEmpty(req.body.usersIds)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.USERS_IDS, errors.REQUIRED)
        return res.status(status).json(result)
    }

    let dataFromPostgres = await manyOrNone(getUsersIdsQuery(req.body.usersIds))
    const usersIdsFromPostgres = _.map(dataFromPostgres, item => item.id)
    if (usersIdsFromPostgres.length < req.body.usersIds.length) {
        const map = _.reduce(usersIdsFromPostgres, (acc,item) => {
            acc[item] = true
            return acc
        }, {})
        const usersNotExisting = _.filter(req.body.usersIds, id => !map[id])
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.PRODUCT, errors.NOT_EXISTS, {
            ids: usersNotExisting
        })
        return res.status(status).json(result)
    }

    dataFromPostgres = await manyOrNone(getProductsUsersQuery(req.params.productId))
    const usersIdsRelatedFromPostgres = _.map(dataFromPostgres, item => item.user_id)
    const map = _.reduce(usersIdsRelatedFromPostgres, (acc, item) => {
        acc[item] = true
        return acc
    }, {})
    const usersIdsRelatedFromRequest = _.filter(req.body.usersIds, id => map[id])
    if (!_.isEmpty(usersIdsRelatedFromRequest)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.RELATION, errors.EXISTS, {
            products_ids: req.params.productId,
            users_ids: usersIdsRelatedFromRequest
        })
        return res.status(status).json(result)
    }

    dataFromPostgres = manyOrNone(addProductsUsersQuery(req.params.productId, req.body.usersIds))
    status = 200
    result = responseHelpers.getSuccessResponse(operations.POST_RELATION, dataFromPostgres, types.RELATIONS)

    return res.status(status).json(result)
}
