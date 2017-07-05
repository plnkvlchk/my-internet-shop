import * as product from '../../db/tables/product.js'
import * as helpers from '../../helpers/product.js'
import getResponse from '../../helpers/response'


export function updateProductById(req, res) {
    let products = product.getProducts()

    if(!helpers.isProductExists(products, req.params.productId)) {
        return res.status(400).json({response: getResponse(false, "update",
            "Element with id " + req.params.productId + " does not exist", "user")})
    }

    let newProperties = req.body
    if (newProperties.id) {
        delete newProperties["id"]
    }

    return res.status(200).json({response: getResponse(true),
        result: product.updateProductById(req.params.productId, newProperties)})
}



