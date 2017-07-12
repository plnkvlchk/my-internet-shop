export default function User(user) {
    if (!user.name) {
        throw new ReferenceError('name')
    }
    if (!user.login) {
        throw new ReferenceError('login')
    }

    this.name = user.name
    this.login = user.login
    this.id = user.id.toString() || (new Date().getTime() + Math.random()).toString() //TODO: check pattern of id
}
