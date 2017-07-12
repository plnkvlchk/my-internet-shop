import * as product from '../../db/tables/product.js'
import * as helpers from '../../helpers/product.js'
import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'

export function updateProductById(req, res) {
    let status = 400
    let result

    let products = product.getProducts()

    if(!helpers.isProductExists(products, req.params.productId)) {
        result = responseHelpers.getFailureResponse(operations.PUT, types.PRODUCT, errors.NOT_EXISTS,
            {"id": req.params.productId})
        return res.status(status).json(result)
    }

    delete req.body["id"]
    status = 200
    result = responseHelpers.getSuccessResponse(operations.PUT, product.updateProductById(req.params.productId, req.body),
        types.PRODUCT)

    return res.status(status).json(result)
}
