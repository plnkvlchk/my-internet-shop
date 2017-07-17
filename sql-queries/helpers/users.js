import squel from 'squel'
import { USERS } from '../../constants'

export function getUsersWithThisIdOrLoginQuery(id, login) {
    return squel.select()
        .from(USERS.NAME)
        .field(USERS.COLUMNS.ID)
        .field(USERS.COLUMNS.LOGIN)
        .where(`${USERS.COLUMNS.ID} = '${id}' OR ${USERS.COLUMNS.LOGIN} = '${login}'`)
        .toString()
}

export function getUsersWithThisLoginQuery(login) {
    return squel.select()
        .from(USERS.NAME)
        .field(USERS.COLUMNS.ID)
        .field(USERS.COLUMNS.LOGIN)
        .where(`${USERS.COLUMNS.LOGIN} = '${login}'`)
        .toString()
}
