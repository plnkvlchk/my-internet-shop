import * as users from './user.js'
import * as products from './product.js'


var catalog = []

export function getCatalog() {
    return catalog
}

// export function addRelations(usersIds, productsIds) {
//     usersIds.forEach((userItem) => {productsIds.forEach(
//         (productItem) => catalog.push({userId: userItem.id, productId: productItem.id}))})
//     return catalog
// }

export function addUserProducts(userId, productsIds) {
    productsIds.forEach((item) => catalog.push({userId: userId, productId: item}))
    return catalog
}

export function addProductUsers(productId, usersIds) {
    usersIds.forEach((item) => catalog.push({userId: item, productId: productId}))
    return catalog
}

export function getUserProducts(user) {
    let productsIds = []
    catalog.filter((item) => item.userId === user.id).forEach((item) => productsIds.push(item.productId))
    return productsIds
}

export function getProductUsers(product) {
    let usersIds = []
    catalog.filter((item) => item.productId === product.id).forEach((item) => usersIds.push(item.userId))
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



export function deleteRow(userId, productId) {
    if (getRow(userId, productId)) {
        delete catalog[getRow(userId, productId)]
        return "The row has been deleted"
    } else {
        return false
    }
}

function getRow(userId, productId) {
    for (var key in catalog) {
        if (catalog[key].userId === userId && catalog[key].productId === productId) {
            return key
        }
    }
    return false
}