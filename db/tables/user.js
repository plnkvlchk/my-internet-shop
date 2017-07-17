import _ from 'lodash'

const users = []

export function getUsers() {
    return users
}

export function addUser(user) {
    users.push(user)
    return user //TODO: you should return only new added elements
}

export function getUserById(userId) {
    return _.find(users, ['id', userId])
}

export function deleteUserById(userId) {
    return users.splice(users.indexOf(getUserById(userId)), 1)
}

export function deleteAllUsers() {
    return users.splice(0, users.length)
}

export function updateUserById(userId, newProperties) {
    const indexOfUserToUpdate = users.indexOf(getUserById(userId))
    _.keys(newProperties).forEach(item => users[indexOfUserToUpdate][item] = newProperties[item])
    return getUserById(userId)
}
