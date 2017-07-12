import * as product from '../../db/tables/product.js'
import * as catalog from '../../db/tables/catalog.js'
import * as helpers from '../../helpers/product.js'
import Product from '../../db/models/product.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import * as userHelpers from '../../helpers/user'
import {getUsers} from '../../db/tables/user.js'
import _ from 'lodash'

export function addProduct(req, res) {
    let status = 400
    let result

    let newProduct
    try {
        newProduct = new Product(req.body)
    } catch(err) {
        result = responseHelpers.getFailureResponse(operations.POST, err.message, errors.REQUIRED)
        return res.status(status).json(result)
    }

    const products = product.getProducts()

    if(!helpers.isProductExists(products, newProduct.id)) {
        result = responseHelpers.getSuccessResponse(operations.POST, product.addProduct(newProduct), types.PRODUCT)
        status = 200
    } else {
        result = responseHelpers.getFailureResponse(operations.POST, types.ID, errors.NOT_UNIQUE,
            {"id": newProduct.id})
    }

    return res.status(status).json(result)
}

export function addProductsUsers(req, res) {
    let status = 400
    let result

    if (!helpers.isProductExists(product.getProducts(), req.params.productId)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.PRODUCT, errors.NOT_EXISTS,
            {"id": req.params.productId})
        return res.status(status).json(result)
    }

    if(!req.body.usersIds || _.isEmpty(req.body.usersIds)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.USERS_IDS, errors.REQUIRED)
        return res.status(status).json(result)
    }

    let usersAbsent = req.body.usersIds.filter((item) => !(userHelpers.isUserExists(getUsers(), item)))
    if(!_.isEmpty(usersAbsent)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.USERS, errors.NOT_EXISTS,
            {"ids": usersAbsent})
        return res.status(status).json(result)
    }

    let relationsExisting = catalog.getCatalog().filter((item) => !(item.userId in req.body.usersIds))
    if(!_.isEmpty(relationsExisting)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.RELATION, errors.EXISTS,
            relationsExisting)
        return res.status(status).json(result)
    }

    status = 200
    result = responseHelpers.getSuccessResponse(operations.POST_RELATION,
        catalog.addProductsUsers(req.params.productId, req.body.usersIds), types.RELATIONS)

    return res.status(status).json(result)
}
