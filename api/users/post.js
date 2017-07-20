import User from '../../db/models/user.js'
import * as responseHelpers from '../../helpers/response'
import {
    OPERATION_TYPES,
    ERRORS_DESCRIPTIONS
} from '../constants'
import _ from 'lodash'
import {
    oneOrNone,
    manyOrNone,
    insert
} from '../../db'
import {
    addUserQuery,
    addUsersProductsQuery,
    getUserByIdQuery,
    getUsersRelationsQuery
} from '../../sql-queries'
import {
    USERS,
    CATALOG
} from '../../constants'
import {
    getUsersWithThisIdOrLoginQuery,
    getUsersWithThisLoginQuery,
    getProductsIdsQuery
} from '../../sql-queries/helpers'
import {
    getIdsNotExisting,
    getIdsRelated
} from '../../helpers/catalog'


export async function addUser(req, res) {
    let newUser
    try {
        newUser = new User(req.body)
    } catch(err) {
        if (err.name === 'ReferenceError')
            return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, err.message,
                ERRORS_DESCRIPTIONS.REQUIRED))
        if (err.name === 'TypeError')
            return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, err.message,
                ERRORS_DESCRIPTIONS.WRONG_TYPE))
    }

    const similarRows = await manyOrNone( newUser.id ?
        getUsersWithThisIdOrLoginQuery(newUser.id, newUser.login) :
        getUsersWithThisLoginQuery(newUser.login))

    if (_.isEmpty(similarRows)) {
        const userAdded = await insert(addUserQuery(newUser))
        return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.POST, userAdded))
    } else {
        const errorData = _.map(similarRows, (user) => {
            if (user.id === newUser.id) {
                return {
                    invalidProperty: USERS.COLUMNS.ID,
                    value: user.id
                }
            } else {
                return {
                    invalidProperty: USERS.COLUMNS.LOGIN,
                    value: user.login
                }
            }
        })
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, errorData[0].invalidProperty,
            ERRORS_DESCRIPTIONS.EXISTS, errorData[0]))
    }
}

export async function addUsersProducts(req, res) {
    const user = await oneOrNone(getUserByIdQuery(req.params.userId))
    if (!user) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, CATALOG.COLUMNS.USER_ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [CATALOG.COLUMNS.USER_ID]: req.params
            }))
    }

    if(!req.body.productsIds || _.isEmpty(req.body.productsIds)) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, CATALOG.COLUMNS.USER_ID,
            ERRORS_DESCRIPTIONS.REQUIRED))
    }

    let productsIdsFromPostgres = await manyOrNone(getProductsIdsQuery(req.body.productsIds))
    productsIdsFromPostgres = _.map(productsIdsFromPostgres, item => item.id)

    const productsIdsNotExisting = getIdsNotExisting(req.body.productsIds, productsIdsFromPostgres)
    if (!_.isEmpty(productsIdsNotExisting)) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, CATALOG.COLUMNS.PRODUCT_ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [CATALOG.COLUMNS.PRODUCT_ID]: productsIdsNotExisting
            }))
    }

    const productsRelatedFromPostgres = await manyOrNone(getUsersRelationsQuery(req.params.userId))
    const productsIdsRelatedFromPostgres = _.map(productsRelatedFromPostgres, item => item.product_id)
    const productsIdsRelatedFromRequest = getIdsRelated(req.body.productsIds, productsIdsRelatedFromPostgres)
    if (!_.isEmpty(productsIdsRelatedFromRequest)) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST,
            [CATALOG.COLUMNS.USER_ID, CATALOG.COLUMNS.PRODUCT_ID], ERRORS_DESCRIPTIONS.EXISTS, {
                [CATALOG.COLUMNS.USER_ID]: req.params.userId,
                [CATALOG.COLUMNS.PRODUCT_ID]: productsIdsRelatedFromRequest
            }))
    }

    const relationsAdded = await insert(addUsersProductsQuery(req.params.userId, req.body.productsIds))
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.POST, relationsAdded))
}
