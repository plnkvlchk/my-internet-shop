import * as product from '../../db/tables/product.js'
import * as catalog from '../../db/tables/catalog.js'
import * as helpers from '../../helpers/product.js'
import Product from '../../db/models/product.js'
import getResponse from '../../helpers/response'
import {isUserExists} from '../../helpers/user'
import {getUsers} from '../../db/tables/user.js'
import * as catalogHelpers from '../../helpers/catalog'

export function addProduct(req, res) {
    const newProduct = new Product(req.body)
    const products = product.getProducts()
    if(!helpers.isProductExists(products, newProduct.id)) {
        return res.status(200).json({response: getResponse(true), result: product.addProduct(newProduct)})
    } else {
        return res.status(400).json({response: getResponse(false, "add",
            "Input 'ID' is not unique", "product")})
    }
}

export function addProductUsers(req, res) {

    if (!helpers.isProductExists(product.getProducts(), req.params.productId)) {
        return res.status(400).json({response: getResponse(false, "add relation to the",
            "Element does not exist", "product", req.params.productId)})
    }

    if (!req.body.usersIds.some((item) => isUserExists(getUsers(), item))) {
        return res.status(400).json({response: getResponse(false, "add relation to the ",
            "Element does not exist", "user", req.body.usersIds.filter((item) =>
                !isUserExists(getUsers(), item)))})
    }

    if (req.body.usersIds.some((item) => catalogHelpers.isRelationExists(catalog.getCatalog(), item,
            req.params.productId))) {
        return res.status(400).json({response: getResponse(false, "add relation to the",
            "Element with id " + req.params.productId + " already has this relation", "product",
            req.body.usersIds.filter((item) => catalogHelpers.isRelationExists(catalog.getCatalog(),
                item, req.params.productId)))})
    }

    return res.status(200).json({response: getResponse(true),
        result: catalog.addProductUsers(req.params.productId, req.body.usersIds)})
}
