import _ from 'lodash'

export function isUserMatchesUniqueConstraint(users, user) {
    return !_.some(users, (item) => (user.id === item.id) || (user.login === item.login))
}
//TODO: jsdoc

export function isUserLoginUnique(users, userLogin) {
    return !_.some(users, ['login', userLogin])
}
//TODO: jsdoc

export function isUserExists(users, userId) {
    return _.some(users, ['id', userId.toString()])
}
