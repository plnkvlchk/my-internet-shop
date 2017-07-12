import _ from 'lodash'

export function isProductExists(products, productId) {
    return _.some(products, (item) => productId.toString() === item.id.toString())
}

