import * as product from '../../db/tables/product.js'
import * as helpers from '../../helpers/product.js'
import * as responseHelpers from '../../helpers/response'
import * as catalogHelpers from '../../helpers/catalog'
import * as catalog from '../../db/tables/catalog'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import _ from 'lodash'

export function deleteProductById(req, res) {
    let status = 400
    let result

    if (helpers.isProductExists(product.getProducts(), req.params.productId)) {
        status = 200
        result = responseHelpers.getSuccessResponse(operations.DELETE, product.deleteProductById(req.params.productId), types.PRODUCT)
    } else {
        result = responseHelpers.getFailureResponse(operations.DELETE, types.PRODUCT, errors.NOT_EXISTS,
            {"id": req.params.productId})
    }

    return res.status(status).json(result)
}

export function deleteAllProducts(req, res) {
    const result = responseHelpers.getSuccessResponse(operations.DELETE, product.deleteAllProducts(), types.PRODUCTS)
    return res.status(200).json(result)
}

export function deleteRelationByIds(req, res) {
    let status = 400
    let result

    if (!helpers.isProductExists(product.getProducts(), req.params.productId)) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.PRODUCT, errors.NOT_EXISTS,
            {"id": req.params.productId})
        return res.status(status).json(result)
    }

    if (!catalogHelpers.isRelationExists(catalog.getCatalog(), req.params.userId, req.params.productId)) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.RELATION, errors.NOT_EXISTS,
            catalog[catalog.indexOf({userId: req.params.userId, productId: req.params.productId})])
        return res.status(status).json(result)
    }

    status = 200
    result = responseHelpers.getSuccessResponse(operations.DELETE_RELATION,
        catalog.deleteRelation(req.params.userId, req.params.productId), types.RELATION)

    return res.status(status).json(result)
}

export function deleteProductsRelations(req, res) {
    let status = 400
    let result

    if (!helpers.isProductExists(product.getProducts(), req.params.productId)) {
        result = responseHelpers.getFailureResponse(operations.DELETE_RELATION, types.PRODUCT, errors.NOT_EXISTS,
            {"id": req.params.productId})
        return res.status(status).json(result)
    }

    status = 200
    const deleted = _.map(catalog.getProductsUsers(req.params.productId), (item) =>
        catalog.deleteRelation(item, req.params.productId))
    result = responseHelpers.getSuccessResponse(operations.DELETE_RELATION, deleted, types.RELATIONS)

    return res.status(status).json(result)
}
