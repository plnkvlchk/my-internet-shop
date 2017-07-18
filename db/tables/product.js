import _ from 'lodash'

const products = []

export function getProducts() {
    return products
}

export function addProduct(product) {
    products.push(product)
    return product //TODO: you should return only new added elements
}

export function getProductById(productId) {
    return _.find(products, ['id', productId])
}

export function deleteProductById(productId) {
    return products.splice(products.indexOf(getProductById(productId)), 1)
}

export function deleteAllProducts() {
    return products.splice(0, products.length)
}

export function updateProductById(productId, newProperties) {
    const indexOfProductToUpdate = products.indexOf(getProductById(productId))
    _.keys(newProperties).forEach(item => products[indexOfProductToUpdate][item] = newProperties[item])
    return getProductById(productId)
}
