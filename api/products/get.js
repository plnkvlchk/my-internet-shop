import * as product from '../../db/tables/product.js'
import * as catalog from '../../db/tables/catalog.js'
import * as helpers from '../../helpers/product.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'

export function getAll(req, res) {
    const result = responseHelpers.getSuccessResponse(operations.GET, product.getProducts(), types.PRODUCTS)
    return res.status(200).json(result)
}

export function getProductById(req, res) {
    let status = 400
    let result

    const products = product.getProducts()

    if (helpers.isProductExists(products, req.params.productId)) {
        status = 200
        result = responseHelpers.getSuccessResponse(operations.GET, product.getProductById(req.params.productId), types.PRODUCT)
    } else {
        result = responseHelpers.getFailureResponse(operations.GET, types.PRODUCT, errors.NOT_EXISTS, {"id": req.params.productId})
    }

    return res.status(status).json(result)
}

export function getProductsUsers(req, res) {
    let status = 400
    let result

    if (!helpers.isProductExists(product.getProducts(), req.params.productId)) {
        result = responseHelpers.getFailureResponse(operations.GET_RELATION, types.PRODUCT, errors.NOT_EXISTS,
            {"id": req.params.productId})
        return res.status(status).json(result)
    }

    status = 200
    result = responseHelpers.getSuccessResponse(operations.GET_RELATION, catalog.getProductsUsers(req.params.productId),
        types.USERS)

    return res.status(status).json(result)
}
