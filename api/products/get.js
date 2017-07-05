import * as product from '../../db/tables/product.js'
import * as catalog from '../../db/tables/catalog.js'
import * as helpers from '../../helpers/product.js'
import getResponse from '../../helpers/response'

export function getAll(req, res) {
    return res.status(200).json({response: getResponse(true), result: product.getProducts()})
}

export function getProductById(req, res) {
    const products = product.getProducts()
    if (helpers.isProductExists(products, req.params.productId)) {
        return res.status(200).json({response: getResponse(true), result: product.getProductById(req.params.productId)})
    } else {
        return res.status(400).json({response: getResponse(false, "get",
            "Element with id " + req.params.productId + " does not exist", "product")})
    }
}

export function getProductUsers(req, res) {
    if (!helpers.isProductExists(product.getProducts(), req.params.productId)) {
        return res.status(400).json({response: getResponse(false, "get",
            "Element does not exist", "product", req.params.productId)})
    }
    return res.status(200).json({response: getResponse(true),
        result: catalog.getProductUsers(product.getProductById(req.params.productId))})
}
