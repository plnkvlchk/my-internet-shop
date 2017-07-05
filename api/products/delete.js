import * as product from '../../db/tables/product.js'
import * as helpers from '../../helpers/product.js'
import getResponse from '../../helpers/response'
import * as catalogHelpers from '../../helpers/catalog'
import * as catalog from '../../db/tables/catalog'


export function deleteProductById(req, res) {
    if (helpers.isProductExists(product.getProducts(), req.params.productId)) {
        return res.status(200).json({response: getResponse(true), result: product.deleteProductById(req.params.productId)})
    } else {
        return res.status(400).json({response: getResponse(false, "delete",
            "Element with id " + req.params.productId + " does not exist", "product")})
    }
}

export function deleteAllProducts(req, res) {
    return res.status(200).json({response: getResponse(true), result: product.deleteAllProducts()})
}

export function deleteRelationByIds(req, res) {
    if (!helpers.isProductExists(product.getProducts(), req.params.productId)) {
        return res.status(400).json({response: getResponse(false, "delete relation of the",
            "Element with id " + req.params.productId + " does not exist", "product")})
    }

    if (!catalogHelpers.isRelationExists(catalog.getCatalog(), req.params.userId, req.params.productId)) {
        return res.status(400).json({response: getResponse(false, "delete relation of the",
            "This element does not exist", "relation")})
    }

    return res.status(200).json({response: getResponse(true),
        result: catalog.deleteRelation(req.params.userId, req.params.productId)})
}

export function deleteProductsRelations(req, res) {
    if (!helpers.isProductExists(product.getProducts(), req.params.productId)) {
        return res.status(400).json({response: getResponse(false, "delete relation of the",
            "Element with id " + req.params.productId + " does not exist", "product")})
    }
    let deleted = []
    catalog.getProductUsers(product.getProductById(req.params.productId)).forEach((item) =>
        deleted.push(catalog.deleteRelation(item, req.params.productId)))
    return res.status(200).json({response: getResponse(true),
        result: deleted})
}