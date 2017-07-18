import * as responseHelpers from '../../helpers/response'
import {
    OPERATIONS,
    ERRORS_DESCRIPTIONS
} from '../constants'
import {
    manyOrNone,
    oneOrNone
} from '../../db'
import {
    deleteProductByIdQuery,
    deleteAllProductsQuery,
    getProductByIdQuery,
    deleteRelationByIdsQuery,
    deleteProductsRelationsQuery,
    deleteProductsDependenciesQuery
} from '../../sql-queries/'
import {
    PRODUCTS,
    CATALOG
} from '../../constants'

export async function deleteProductById(req, res) {
    const product = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!product) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.DELETE, PRODUCTS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, req.params.productId))
    }

    await manyOrNone(deleteProductsDependenciesQuery(req.params.productId))
    const productDeleted = await oneOrNone(deleteProductByIdQuery(req.params.productId))

    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATIONS.DELETE, productDeleted))
}

export async function deleteAllProducts(req, res) {
    const productsDeleted = await manyOrNone(deleteAllProductsQuery())
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATIONS.DELETE, productsDeleted))
}

export async function deleteRelationByIds(req, res) {
    const product = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!product) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.DELETE, PRODUCTS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, req.params.productId))
    }

    const relationDeleted = await oneOrNone(deleteRelationByIdsQuery(req.params.userId, req.params.productId))
    if (!relationDeleted) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.DELETE,
            [CATALOG.COLUMNS.USER_ID, CATALOG.COLUMNS.PRODUCT_ID], ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [CATALOG.COLUMNS.USER_ID]: req.params.userId,
                [CATALOG.COLUMNS.PRODUCT_ID]: req.params.productId
            }))
    }

    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATIONS.DELETE, relationDeleted))
}

export async function deleteProductsRelations(req, res) {
    const product = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!product) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.DELETE, PRODUCTS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [PRODUCTS.COLUMNS.ID]: req.params.productId
            }))
    }

    const relationsDeleted = await manyOrNone(deleteProductsRelationsQuery(req.params.productId))

    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATIONS.DELETE, relationsDeleted))
}
