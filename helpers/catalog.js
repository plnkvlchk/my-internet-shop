//TODO: jsdoc
export function isRelationExists(catalog, userId, productId) {
    return catalog.some(item => userId.toString() === item.userId && productId.toString() === item.productId) //TODO: use lodash some
}


//TODO: eslint

//TODO: why do you need all these empty lines??? only one at the end of file is required

