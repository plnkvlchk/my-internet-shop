import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import { updateProductByIdQuery, getProductByIdQuery } from '../../sql-queries'
import { oneOrNone } from '../../db'
import { PRODUCTS } from '../../constants'
import _ from 'lodash'

export async function updateProductById(req, res) {
    let status = 400
    let result

    delete req.body["id"]
    _.forEach(_.keys(req.body), item => {
        if (_.values(PRODUCTS.COLUMNS).indexOf(item) === -1) {
            delete req.body[item]
        }
    })

    if (_.isEmpty(req.body)) {
        const currentProduct = await oneOrNone(getProductByIdQuery(req.params.productId))
        result = responseHelpers.getSuccessResponse(operations.PUT, currentProduct, types.PRODUCT)
        status = 200
        return res.status(status).json(result)
    }

    const dataFromPostgres = await oneOrNone(updateProductByIdQuery(req.params.productId, req.body))

    if (dataFromPostgres) {
        result = responseHelpers.getSuccessResponse(operations.PUT, dataFromPostgres, types.PRODUCT)
        status = 200
    } else {
        result = responseHelpers.getFailureResponse(operations.PUT, types.PRODUCT, errors.NOT_EXISTS, {
            "id": req.params.productId
        })
    }

    return res.status(status).json(result)
}
