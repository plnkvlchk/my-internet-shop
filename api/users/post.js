import * as user from '../../db/tables/user.js'
import User from '../../db/models/user.js'
import * as catalog from '../../db/tables/catalog'
import * as helpers from '../../helpers/user.js'
import * as catalogHelpers from '../../helpers/catalog'
import * as product from '../../helpers/product'
import {getProducts} from '../../db/tables/product.js'
import getResponse from '../../helpers/response'


export function addUser(req, res) {
    if (!helpers.isUserObjectContainsRequiredProperties(req.body)) {
        return res.status(400).json({response: getResponse(false, "add",
            "Input object must contain 'LOGIN' property", "user")})
    }
    const newUser = new User(req.body)
    const users = user.getUsers()
    if (helpers.isUserMatchesUniqueConstraint(users, newUser)) {
        return res.status(200).json({response: getResponse(true), result: user.addUser(newUser)})
    } else {
        //return res.status(400).json({response: getResponse(false, "add", "Input 'ID' or 'LOGIN' is not unique", "user")})

        if (!helpers.isUserLoginUnique(users, newUser.login)) {
            return res.status(400).json({response: getResponse(false, "add", "Input 'LOGIN' is not unique")})
        } else {
            return res.status(400).json({response: getResponse(false, "add", "Input 'ID' is not unique", "user")})
        }
    }
}

export function addUserProducts(req, res) {
    if (!helpers.isUserExists(user.getUsers(), req.params.userId)) {
        return res.status(400).json({response: getResponse(false, "add relation to the",
            "Element does not exist", "user", req.params.userId)})
    }
    if (!req.body.productsIds.some((item) => product.isProductExists(getProducts(), item))) {
        return res.status(400).json({response: getResponse(false, "add relation to the ",
            "Element does not exist", "product", req.body.productsIds.filter((item) =>
                !product.isProductExists(getProducts(), item)))})
    }
    if (req.body.productsIds.some((item) =>
            catalogHelpers.isRelationExists(catalog.getCatalog(), req.params.userId, item))) {
        return res.status(400).json({response: getResponse(false, "add relation to the",
            "Element with id " + req.params.userId + " already has this relation", "user",
            req.body.productsIds.filter((item) => catalogHelpers.isRelationExists(catalog.getCatalog(),
                req.params.userId, item)))})
    }
    return res.status(200).json({response: getResponse(true),
        result: catalog.addUserProducts(req.params.userId, req.body.productsIds)})
}





