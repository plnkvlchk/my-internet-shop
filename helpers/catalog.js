import _ from 'lodash'

export function isRelationExists(catalog, userId, productId) {
    return _.some(catalog, { 'userId': userId, 'productId': productId })
}
