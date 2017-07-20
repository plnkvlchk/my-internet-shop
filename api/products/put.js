import * as responseHelpers from '../../helpers/response'
import {
    OPERATION_TYPES,
    ERRORS_DESCRIPTIONS
} from '../constants'
import {
    updateProductByIdQuery,
    getProductByIdQuery
} from '../../sql-queries'
import {
    oneOrNone,
    update
} from '../../db'
import { PRODUCTS } from '../../constants'
import _ from 'lodash'
import { isValuesValid } from '../../helpers/product'

export async function updateProductById(req, res) {
    let newValues = {}
    _.forEach(PRODUCTS.COLUMNS, (value) => {
        if (!(value === PRODUCTS.COLUMNS.ID) && req.body[value] ) {
            newValues[value] = req.body[value]
        }
    })

    try {
        isValuesValid(newValues)
    } catch (err) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.PUT, err.message,
            ERRORS_DESCRIPTIONS.WRONG_TYPE, {
                [err.message]: newValues[err.message]
            }))
    }

    if (_.isEmpty(req.body)) {
        const product = await oneOrNone(getProductByIdQuery(req.params.productId))
        return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.PUT, product))
    }

    const productUpdated = await update(updateProductByIdQuery(req.params.productId, req.body))

    if (productUpdated) {
        return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.PUT, productUpdated))
    } else {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.PUT, PRODUCTS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [PRODUCTS.COLUMNS.ID]: req.params.productId
            }))
    }
}
