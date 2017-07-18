export default function User(user) {
    const uuidPattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

    if (!user.name) {
        throw new ReferenceError('name')
    }
    if (!user.login) {
        throw new ReferenceError('login')
    }
    if (user.id && !uuidPattern.text(user.id)) {
        console.log('Wrong id format. New id will be generated automatically')
    }

    this.name = user.name
    this.login = user.login

    if (user.id && uuidPattern.test(user.id)) {
        this.id = user.id.toString()
    }
}
