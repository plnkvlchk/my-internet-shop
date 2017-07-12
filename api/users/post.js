import * as user from '../../db/tables/user.js'
import User from '../../db/models/user.js'
import * as catalog from '../../db/tables/catalog'
import * as helpers from '../../helpers/user.js'
import * as productHelpers from '../../helpers/product'
import {getProducts} from '../../db/tables/product.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import _ from 'lodash'

export function addUser(req, res) {
    let result
    let status = 400

    // if (!helpers.isUserObjectContainsRequiredProperties(req.body)) {
    //     result = responseHelpers.getFailureResponse(operations.POST, types.LOGIN, errors.REQUIRED)
    //     return res.status(status).json(result)
    // }

    let newUser
    try {
        newUser = new User(req.body)
    } catch(err) {
        result = responseHelpers.getFailureResponse(operations.POST, err.message, errors.REQUIRED)
        return res.status(status).json(result)
    }

    const users = user.getUsers()

    if (helpers.isUserMatchesUniqueConstraint(users, newUser)) {
        result = responseHelpers.getSuccessResponse(operations.POST, user.addUser(newUser), types.USER)
        status = 200
    } else {
        if (!helpers.isUserLoginUnique(users, newUser.login)) {
            result = responseHelpers.getFailureResponse(operations.POST, types.LOGIN, errors.NOT_UNIQUE,
                { "login": req.body.login })
        } else {
            result = responseHelpers.getFailureResponse(operations.POST, types.ID, errors.NOT_UNIQUE,
                { "id": req.body.id })
        }
    }

    return res.status(status).json(result)
}

export function addUsersProducts(req, res) {
    let result
    let status = 400

    if (!helpers.isUserExists(user.getUsers(), req.params.userId)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.USER, errors.NOT_EXISTS,
            { "id": req.params.userId })
        return res.status(status).json(result)
    }

    if(!req.body.productsIds || _.isEmpty(req.body.productsIds)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.PRODUCTS_IDS, errors.REQUIRED)
        return res.status(status).json(result)
    }

    let productsAbsent = req.body.productsIds.filter((item) => !(productHelpers.isProductExists(getProducts(), item)))
    if(!_.isEmpty(productsAbsent)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.PRODUCTS, errors.NOT_EXISTS,
            {"ids": productsAbsent})
        return res.status(status).json(result)
    }

    let relationsExisting = catalog.getCatalog().filter((item) => !(item.productId in req.body.productsIds))
    if(!_.isEmpty(relationsExisting)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.RELATION, errors.EXISTS,
            relationsExisting)
        return res.status(status).json(result)
    }

    status = 200
    result = responseHelpers.getSuccessResponse(operations.POST_RELATION, catalog.addUsersProducts(req.params.userId,
        req.body.productsIds), types.RELATIONS)

    return res.status(status).json(result)
}
