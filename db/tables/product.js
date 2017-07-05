import Product from '../models/product.js'

var products = [];

export function getProducts() {
    return products;
}

export function addProduct(product) {
    products.push(product)
    return product
}

export function getProductById(productId) {
    return products.filter(item => item.id === productId)[0]
}

export function deleteProductById(productId) {
    return products.splice(products.indexOf(getProductById(productId)), 1)
}

export function deleteAllProducts() {
    products = []
    return products
}

export function updateProductById(productId, newProductsProperties) {
    Object.keys(newProductsProperties).forEach(item => products[products.indexOf(getProductById(productId))][item]
        = newProductsProperties[item])
    return getProductById(productId)
}


