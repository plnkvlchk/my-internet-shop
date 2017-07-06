import Product from '../models/product.js' //TODO: unused import

var products = [];

export function getProducts() {
    return products;
}

export function addProduct(product) {
    products.push(product)
    return product //TODO: you should return only new added elements
}

export function getProductById(productId) {
    return products.filter(item => item.id === productId)[0] //TODO: lodash find

}

export function deleteProductById(productId) {
    return products.splice(products.indexOf(getProductById(productId)), 1)
}

export function deleteAllProducts() {
    products = [] //TODO: memory leak could apper with such behaviour

    return products
}

export function updateProductById(productId, newProductsProperties) {
    Object.keys(newProductsProperties).forEach(item => products[products.indexOf(getProductById(productId))][item]
        = newProductsProperties[item]) //TODO: lodash values

    //TODO: eslint statement is hard to understand with such formatting
    //TODO: why we need to calculate index of the same user the same times as properties into newUsersProperties???


//TODO: empty lines


    return getProductById(productId)
}


