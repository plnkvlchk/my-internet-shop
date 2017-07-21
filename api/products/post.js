import Product from '../../db/models/product.js'
import * as responseHelpers from '../../helpers/response'
import {
    OPERATION_TYPES,
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
    manyOrNone,
    insert
} from '../../db'
import {
    PRODUCTS,
    CATALOG
} from '../../constants'
import {
    getIdsNotExisting,
    getIdsRelated
} from '../../helpers/catalog'

export async function addProduct(req, res) {
    let newProduct
    try {
        newProduct = new Product(req.body)
    } catch(err) {
        if (err.name === 'ReferenceError')
            return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, err.message,
                ERRORS_DESCRIPTIONS.REQUIRED))
        if (err.name === 'TypeError')
            return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, err.message,
                ERRORS_DESCRIPTIONS.WRONG_TYPE))
    }

    if(newProduct.id) {
        const productWithSameId = await oneOrNone(getProductByIdQuery(newProduct.id))
        if (productWithSameId) {
            return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, PRODUCTS.COLUMNS.ID,
                ERRORS_DESCRIPTIONS.EXISTS, {
                    [PRODUCTS.COLUMNS.ID]: newProduct.id
                }))
        }
    }

    const productAdded = await insert(addProductQuery(newProduct))
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.POST, productAdded))
}

export async function addProductsUsers(req, res) {
    const product = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!product) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, PRODUCTS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [PRODUCTS.COLUMNS.ID]: req.params.productId
            }))
    }

    if((!req.body.usersIds) || _.isEmpty(req.body.usersIds)) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST,
            CATALOG.COLUMNS.USER_ID, ERRORS_DESCRIPTIONS.REQUIRED))
    }

    let usersIds = await manyOrNone(getUsersIdsQuery(req.body.usersIds))
    usersIds = _.map(usersIds, item => item.id)
    const usersIdsNotExisting = getIdsNotExisting(req.body.usersIds, usersIds)
    if (!_.isEmpty(usersIdsNotExisting)) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST, CATALOG.COLUMNS.USER_ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, usersIdsNotExisting))
    }

    let relationsOfThisProduct = await manyOrNone(getProductsRelationsQuery(req.params.productId))
    const usersIdsRelated = _.map(relationsOfThisProduct, item => item.user_id)
    const usersIdsRelatedFromRequest = getIdsRelated(req.body.usersIds, usersIdsRelated)
    if (!_.isEmpty(usersIdsRelatedFromRequest)) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.POST,
            [CATALOG.COLUMNS.USER_ID, CATALOG.COLUMNS.PRODUCT_ID], ERRORS_DESCRIPTIONS.EXISTS, {
                [CATALOG.COLUMNS.PRODUCT_ID]: req.params.productId,
                [CATALOG.COLUMNS.USER_ID]: usersIdsRelatedFromRequest
            }))
    }

    const relationsAdded = insert(addProductsUsersQuery(req.params.productId, req.body.usersIds))
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.POST, relationsAdded))
}
