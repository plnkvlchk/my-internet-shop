import * as responseHelpers from '../../helpers/response'
import {
    OPERATIONS,
    ERRORS_DESCRIPTIONS
} from '../constants'
import {
    updateProductByIdQuery,
    getProductByIdQuery
} from '../../sql-queries'
import { oneOrNone } from '../../db'
import { PRODUCTS } from '../../constants'
import _ from 'lodash'

export async function updateProductById(req, res) {
    delete req.body["id"]
    _.forEach(_.keys(req.body), item => {
        if (_.values(PRODUCTS.COLUMNS).indexOf(item) === -1) {
            delete req.body[item]
        }
    })

    if (_.isEmpty(req.body)) {
        const product = await oneOrNone(getProductByIdQuery(req.params.productId))
        return res.status(200).json(responseHelpers.getSuccessResponse(OPERATIONS.PUT, product))
    }

    const productUpdated = await oneOrNone(updateProductByIdQuery(req.params.productId, req.body))

    if (productUpdated) {
        return res.status(200).json(responseHelpers.getSuccessResponse(OPERATIONS.PUT, productUpdated))
    } else {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATIONS.PUT, PRODUCTS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [PRODUCTS.COLUMNS.ID]: req.params.productId
            }))
    }
}
