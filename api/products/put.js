import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import { updateProductByIdQuery } from '../../sql-queries'
import { oneOrNoneReturning } from '../../db'

export async function updateProductById(req, res) {
    let status = 400
    let result

    delete req.body["id"]

    const dataFromPostgres = await oneOrNoneReturning(updateProductByIdQuery(req.params.productId, req.body))

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
