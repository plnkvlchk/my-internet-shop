import User from '../models/user.js' //TODO: eslint unused import

var users = [];

export function getUsers() {
    return users;
}

export function addUser(user) {
    users.push(user)
    return user //TODO: you should return only new added elements
}

export function getUserById(userId) {
    return users.filter(item => item.id === userId)[0]//TODO: lodash find
}

export function deleteUserById(userId) {
    return users.splice(users.indexOf(getUserById(userId)), 1)
}

export function deleteAllUsers() {
    users = [] //TODO: memory leak could apper with such behaviour

    return users
}

export function updateUserById(userId, newUsersProperties) {
    Object.keys(newUsersProperties).forEach(item =>
        users[users.indexOf(getUserById(userId))][item] = newUsersProperties[item]) //TODO: lodash values
    //TODO: eslint statement is hard to understand with such formatting
    //TODO: why we need to calculate index of the same user the same times as properties into newUsersProperties???


//TODO: empty lines


    return getUserById(userId)
}

//TODO: empty lines





//TODO: eslint
//TODO: large parts of commented code are disallowed

// export function addUser(name, login, id) {
//
//     if (!userExists(login, id)) {
//         users.push(new User(name, login, id));
//         return "User " + id + " has been successfully added"
//     }
//     else {
//         return false
//     }
// }

// export function getUserById(id) {
//     for (var key in users) {
//         if (users[key].id === id) {
//             return users[key];
//         }
//     }
//     return false
// }

// export function deleteUserById(id) {
//     if (getUserById(id)) {
//         return users.splice(users.indexOf(getUserById(id)), 1)
//     } else {
//         return false
//     }
// }

// export function deleteAllUsers() {
//     for (var key in users) {
//         delete users[key]
//     }
//     return "All users have been deleted"
// }

// export function updateUserById(id, obj) {
//     var userIndex = users.indexOf(getUserById(id))
//     if (getUserById(id)) {
//         if (!userExists(obj.login, obj.id)) {
//             for (var key in obj) {
//                 if (key in users[userIndex]) {
//                     users[userIndex][key] = obj[key]
//                 }
//             }
//             return "User " + id + " has been updated"
//         }
//         else {
//             return "Such user already exists"
//         }
//     }
//     else {
//         return false
//     }
// }

// function userExists(login, id) {
//     if (id) {
//         for (var key in users) {
//             if (users[key].id === id) {
//                 return true
//             }
//         }
//     }
//     if (login) {
//         for (var key in users) {
//             if (users[key].login === login) {
//                 return true
//             }
//         }
//     }
//     return false
// }

