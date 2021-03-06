import { USERS } from '../../constants'
import { isUuidValueCorrect } from '../../helpers/catalog'

export default function User(user) {
    if (!user.name) {
        throw new ReferenceError(USERS.COLUMNS.NAME)
    }
    if (!user.login) {
        throw new ReferenceError(USERS.COLUMNS.LOGIN)
    }
    if (user.id && !(isUuidValueCorrect(user.id))) {
        throw new TypeError(USERS.COLUMNS.ID)
    }

    this.name = user.name
    this.login = user.login

    if (user.id) {
        this.id = user.id.toString()
    }
}
