// checks if input object is suitable for adding/updating the table
export function isUserMatchesUniqueConstraint(users, user) {
    return !users.some(item => (user.id === item.id) || (user.login === item.login))
}

export function isUserLoginUnique(users, userLogin) {
    return !users.some(item => userLogin === item.login)
}

// checks if user already exists by id
export function isUserExists(users, userId) {
    return users.some(item => userId.toString() === item.id)
}

export function isUsersEmpty(users) {
    return users.length === 0
}

export function isUserObjectContainsRequiredProperties(user) {
    return Object.keys(user).some(item => item === 'login')
}
