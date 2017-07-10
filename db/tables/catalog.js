import * as users from './user.js' //TODO: unused import
import * as products from './product.js' //TODO: unused import

//TODO:jsdoc
//TODO:eslint
var catalog = []

export function getCatalog() {
    return catalog
}

//TODO: commented code
// export function addRelations(usersIds, productsIds) {
//     usersIds.forEach((userItem) => {productsIds.forEach(
//         (productItem) => catalog.push({userId: userItem.id, productId: productItem.id}))})
//     return catalog
// }

export function addUserProducts(userId, productsIds) {
    productsIds.forEach((item) => catalog.push({userId: userId, productId: item}))
    return catalog //TODO: you should return only new added elements
}

export function addProductUsers(productId, usersIds) {
    usersIds.forEach((item) => catalog.push({userId: item, productId: productId}))
    return catalog //TODO: you should return only new added elements
}

export function getUserProducts(user) {
    let productsIds = []
    catalog.filter((item) => item.userId === user.id).forEach((item) => productsIds.push(item.productId)) //TODO: use lodash map
    return productsIds
}

export function getProductUsers(product) {
    let usersIds = []
    catalog.filter((item) => item.productId === product.id).forEach((item) => usersIds.push(item.userId)) //TODO:lodash map
    return usersIds
}

export function deleteRelation(userId, productId) {
    let deletedRelation
    catalog.forEach((item) => {
        if (item.userId === userId.toString() && item.productId === productId.toString()) {
            deletedRelation = catalog.splice(catalog.indexOf(item), 1)
        }
    })
    return deletedRelation
}

//TODO: comments
// export function addRow(userId, productsIds) {
//     productsIds.forEach((item) => catalog.push({userId: userId, productId: item.id}))
// }

// export function getUsersProducts(userId) {
//
//
// }

// export function getUserProducts(userId) {
//     var userProducts = []
//     for (var key in catalog) {
//         if (catalog[key].userId === userId) {
//             userProducts.push(products.getProductById(catalog[key].productId))
//         }
//     }
//     return userProducts
// }
//
// export function getProductUsers(productId) {
//     var productUsers = []
//     for (var key in catalog) {
//         if (catalog[key].productId === productId) {
//             productUsers.push(users.getUserById(catalog[key].userId))
//         }
//     }
//     return productUsers
// }


//TODO: unused
export function deleteRow(userId, productId) {
    if (getRow(userId, productId)) {
        delete catalog[getRow(userId, productId)] //TODO: splice!!! delete just makes undefined at index
        return "The row has been deleted"
    } else {
        return false
    }
}

function getRow(userId, productId) {
    for (var key in catalog) { //TODO: lodash keys
        //TODO: key is bad name for this variable
        if (catalog[key].userId === userId && catalog[key].productId === productId) {
            return key
        }
    }
    return false
}