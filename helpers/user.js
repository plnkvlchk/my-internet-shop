// checks if input object is suitable for adding/updating the table
//TODO: jsdoc

export function isUserMatchesUniqueConstraint(users, user) {
    return !users.some(item => (user.id === item.id) || (user.login === item.login))//TODO: use lodash some

}
//TODO: jsdoc

export function isUserLoginUnique(users, userLogin) {
    return !users.some(item => userLogin === item.login) //TODO: use lodash some
}
//TODO: jsdoc

// checks if user already exists by id
export function isUserExists(users, userId) {
    return users.some(item => userId.toString() === item.id) //TODO: use lodash some
}
//TODO: jsdoc

export function isUsersEmpty(users) {
    return users.length === 0
}

export function isUserObjectContainsRequiredProperties(user) {
    return Object.keys(user).some(item => item === 'login') //TODO: use lodash values
}
