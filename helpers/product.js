export function isProductExists(products, productId) {
    return products.some(item => productId.toString() === item.id)
}

export function isProductsEmpty(products) {
    return products.length === 0
}
