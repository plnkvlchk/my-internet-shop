import Product from '../../db/models/product.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import _ from 'lodash'
import { getProductByIdQuery, addProductQuery, addProductsUsersQuery } from '../../sql-queries/'
import { oneOrNone, oneOrNoneReturning, manyOrNone } from '../../db'

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

    const dataFromPostgres = await oneOrNoneReturning(addProductQuery(newProduct))
    result = responseHelpers.getSuccessResponse(operations.POST, dataFromPostgres, types.PRODUCT)
    status = 200
    return res.status(status).json(result)
}

export async function addProductsUsers(req, res) {
    let status = 400
    let result

    const currentProduct = oneOrNone(getProductByIdQuery(req.params.productId))
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

    // let usersAbsent = req.body.usersIds.filter((item) => !(userHelpers.isUserExists(getUsers(), item)))
    // if(!_.isEmpty(usersAbsent)) {
    //     result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.USERS, errors.NOT_EXISTS,
    //         {"ids": usersAbsent})
    //     return res.status(status).json(result)
    // }
    //
    // let relationsExisting = catalog.getCatalog().filter((item) => !(item.userId in req.body.usersIds))
    // if(!_.isEmpty(relationsExisting)) {
    //     result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.RELATION, errors.EXISTS,
    //         relationsExisting)
    //     return res.status(status).json(result)
    // }

    const dataFromPostgres = manyOrNone(addProductsUsersQuery(req.params.productId, req.body.usersIds))
    status = 200
    result = responseHelpers.getSuccessResponse(operations.POST_RELATION, dataFromPostgres, types.RELATIONS)

    return res.status(status).json(result)
}
