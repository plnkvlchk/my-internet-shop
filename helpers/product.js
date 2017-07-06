//TODO: jsdoc

export function isProductExists(products, productId) {
    return products.some(item => productId.toString() === item.id) //TODO: use lodash some

}

//TODO: unused function

export function isProductsEmpty(products) {
    return products.length === 0
}
