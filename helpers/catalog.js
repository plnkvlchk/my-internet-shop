export function isRelationExists(catalog, userId, productId) {
    return catalog.some(item => userId.toString() === item.userId && productId.toString() === item.productId)
}





