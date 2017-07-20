import { USERS } from '../../constants'

export default function User(user) {
    const uuidPattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

    if (!user.name) {
        throw new ReferenceError(USERS.COLUMNS.NAME)
    }
    if (!user.login) {
        throw new ReferenceError(USERS.COLUMNS.LOGIN)
    }
    if (user.id && !uuidPattern.text(user.id)) {
        throw new TypeError(USERS.COLUMNS.ID)
    }

    this.name = user.name
    this.login = user.login

    if (user.id && uuidPattern.test(user.id)) {
        this.id = user.id.toString()
    }
}
