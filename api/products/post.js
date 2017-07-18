import Product from '../../db/models/product.js'
import * as responseHelpers from '../../helpers/response'
import {
    OPERATIONS,
    ERRORS_DESCRIPTIONS
} from '../constants'
import _ from 'lodash'
import {
    getProductByIdQuery,
    addProductQuery,
    addProductsUsersQuery,
    getProductsRelationsQuery,
    getUsersIdsQuery
} from '../../sql-queries/'
import {
    oneOrNone,
    manyOrNone
} from '../../db'
import {
    PRODUCTS,
    CATALOG
} from '../../constants'

export async function addProduct(req, res) {
    let newProduct
    try {
        newProduct = new Product(req.body)
    } catch(err) {
        if (err.name === 'ReferenceError')
            return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.POST, err.message,
                ERRORS_DESCRIPTIONS.REQUIRED))
        if (err.name === 'TypeError')
            return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.POST, err.message,
                ERRORS_DESCRIPTIONS.WRONG_TYPE))
    }

    if(newProduct.id) {
        const productWithSameId = await oneOrNone(getProductByIdQuery(newProduct.id))
        if (productWithSameId) {
            return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.POST, PRODUCTS.COLUMNS.ID,
                ERRORS_DESCRIPTIONS.EXISTS, {
                    [PRODUCTS.COLUMNS.ID]: newProduct.id
                }))
        }
    }

    const productAdded = await oneOrNone(addProductQuery(newProduct))
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATIONS.POST, productAdded))
}

export async function addProductsUsers(req, res) {
    const product = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!product) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.POST, PRODUCTS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [PRODUCTS.COLUMNS.ID]: req.params.productId
            }))
    }

    if(!req.body.usersIds || _.isEmpty(req.body.usersIds)) {
        return res.status(400).json(OPERATIONS.POST, CATALOG.COLUMNS.USER_ID, ERRORS_DESCRIPTIONS.REQUIRED)
    }

    let usersIds = await manyOrNone(getUsersIdsQuery(req.body.usersIds))
    usersIds = _.map(usersIds, item => item.id)
    if (usersIds.length < req.body.usersIds.length) {
        const map = _.reduce(usersIds, (acc,item) => {
            acc[item] = true
            return acc
        }, {})
        const usersIdsNotExisting = _.filter(req.body.usersIds, id => !map[id])
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.POST, CATALOG.COLUMNS.USER_ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [CATALOG.COLUMNS.USER_ID]: usersIdsNotExisting
            }))
    }

    let relationsOfThisProduct = await manyOrNone(getProductsRelationsQuery(req.params.productId))
    const usersIdsRelated = _.map(relationsOfThisProduct, item => item.user_id)
    const map = _.reduce(usersIdsRelated, (acc, item) => {
        acc[item] = true
        return acc
    }, {})
    const usersIdsRelatedFromRequest = _.filter(req.body.usersIds, id => map[id])
    if (!_.isEmpty(usersIdsRelatedFromRequest)) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.POST,
            CATALOG.COLUMNS.PRODUCT_ID, CATALOG.COLUMNS.USER_ID, ERRORS_DESCRIPTIONS.EXISTS, {
                [CATALOG.COLUMNS.PRODUCT_ID]: req.params.productId,
                [CATALOG.COLUMNS.USER_ID]: usersIdsRelatedFromRequest
            }))
    }

    const relationsAdded = manyOrNone(addProductsUsersQuery(req.params.productId, req.body.usersIds))
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATIONS.POST, relationsAdded))
}
