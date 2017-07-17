import User from '../../db/models/user.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import _ from 'lodash'
import { oneOrNone, manyOrNone } from '../../db'
import { addUserQuery, addUsersProductsQuery, getUserByIdQuery } from '../../sql-queries'
import { USERS } from '../../constants'
import { getUsersWithThisIdOrLoginQuery, getUsersWithThisLoginQuery } from '../../sql-queries/helpers'

export async function addUser(req, res) {
    let result
    let status = 400

    let newUser
    try {
        newUser = new User(req.body)
    } catch(err) {
        result = responseHelpers.getFailureResponse(operations.POST, err.message, errors.REQUIRED)
        return res.status(status).json(result)
    }

    let similarRows
    if (newUser.id) {
        similarRows = await manyOrNone(getUsersWithThisIdOrLoginQuery(newUser.id, newUser.login))
    } else {
        similarRows = await manyOrNone(getUsersWithThisLoginQuery(newUser.login))
    }

    // TODO: check uuid pattern, catch
    if (_.isEmpty(similarRows)) {
        const dataFromPostgres = await oneOrNone(addUserQuery(newUser))
        result = responseHelpers.getSuccessResponse(operations.POST, dataFromPostgres, types.USER)
        status = 200
    } else {
        const errorData = _.map(similarRows, (item) => {
            if (item.id === newUser.id) {
                return {
                    invalidProperty: USERS.COLUMNS.ID,
                    value: item.id
                }
            } else {
                return {
                    invalidProperty: USERS.COLUMNS.LOGIN,
                    value: item.login
                }
            }
        })
        result = responseHelpers.getFailureResponse(operations.POST, errorData[0].invalidProperty, errors.NOT_UNIQUE,
            errorData[0].value)
    }

    return res.status(status).json(result)
}

export async function addUsersProducts(req, res) {
    let result
    let status = 400

    const currentUser = oneOrNone(getUserByIdQuery(req.params.userId))
    if (!currentUser) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.USER, errors.NOT_EXISTS,
            { "id": req.params.userId })
        return res.status(status).json(result)
    }

    if(!req.body.productsIds || _.isEmpty(req.body.productsIds)) {
        result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.PRODUCTS_IDS, errors.REQUIRED)
        return res.status(status).json(result)
    }

    const dataFromPostgres = manyOrNone(addUsersProductsQuery(req.params.userId, req.body.productsIds))
    result = responseHelpers.getSuccessResponse(operations.POST_RELATION, dataFromPostgres, types.RELATIONS)

    // let productsAbsent = req.body.productsIds.filter((item) => !(productHelpers.isProductExists(getProducts(), item)))
    // if(!_.isEmpty(productsAbsent)) {
    //     result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.PRODUCTS, errors.NOT_EXISTS,
    //         {"ids": productsAbsent})
    //     return res.status(status).json(result)
    // }
    //
    // let relationsExisting = catalog.getCatalog().filter((item) => !(item.productId in req.body.productsIds))
    // if(!_.isEmpty(relationsExisting)) {
    //     result = responseHelpers.getFailureResponse(operations.POST_RELATION, types.RELATION, errors.EXISTS,
    //         relationsExisting)
    //     return res.status(status).json(result)
    // }
    //
    // status = 200
    // result = responseHelpers.getSuccessResponse(operations.POST_RELATION, catalog.addUsersProducts(req.params.userId,
    //     req.body.productsIds), types.RELATIONS)

    return res.status(status).json(result)
}
