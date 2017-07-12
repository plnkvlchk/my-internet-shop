import _ from 'lodash'

const catalog = []

export function getCatalog() {
    return catalog
}

export function addUsersProducts(userId, productsIds) {
    productsIds.forEach((item) => catalog.push({userId: userId, productId: item}))
    return catalog.slice(catalog.length - productsIds.length, productsIds.length)
}

export function addProductsUsers(productId, usersIds) {
    usersIds.forEach((item) => catalog.push({userId: item, productId: productId}))
    return catalog.slice(catalog.length - usersIds.length, usersIds.length)
}

export function getUsersProducts(userId) {
    return catalog.filter((item) => item.userId === userId).map((item) => {return {userId: userId, productId: item.productId}})
}

export function getProductsUsers(productId) {
    return catalog.filter((item) => item.productId === productId).map((item) => {return {userId: item.userId, productId: productId}})
}

export function deleteRelation(userId, productId) {
    return catalog.splice(_.findIndex(catalog, {'userId': userId, 'productId': productId}), 1)
}
