import * as responseHelpers from '../../helpers/response'
import {
    OPERATION_TYPES,
    ERRORS_DESCRIPTIONS
} from '../constants'
import {
    manyOrNone,
    oneOrNone
} from '../../db'
import {
    getAllProductsQuery,
    getProductByIdQuery,
    getProductsRelationsQuery
} from '../../sql-queries'
import { PRODUCTS } from '../../constants'

export async function getAll(req, res) {
    const products = await manyOrNone(getAllProductsQuery())
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.GET, products))
}

export async function getProductById(req, res) {
    const product = await oneOrNone(getProductByIdQuery(req.params.productId))

    if (product) {
        return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.GET, product))
    } else {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.GET, PRODUCTS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [PRODUCTS.COLUMNS.ID]: req.params.productId
            }))
    }
}

export async function getProductsRelations(req, res) {
    const product = await oneOrNone(getProductByIdQuery(req.params.productId))
    if (!product) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.GET, PRODUCTS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [PRODUCTS.COLUMNS.ID]: req.params.productId
            }))
    }

    const relations = await manyOrNone(getProductsRelationsQuery(req.params.productId))

    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.GET, relations))
}
