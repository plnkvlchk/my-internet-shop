import _ from 'lodash'

export default function User(user) {
    if (!user.name) {
        throw new ReferenceError('name')
    }
    if (!user.login) {
        throw new ReferenceError('login')
    }

    this.name = user.name
    this.login = user.login
    //TODO: check pattern of id
    if (user.id) {
        this.id = user.id.toString()
    }
}
