import squel from 'squel'
import { USERS } from '../../constants/tables'

export function getAllUsersQuery() {
    return squel.select()
        .from(USERS.NAME)
        .toString()
}

export function getUserByIdQuery(id) {
    return squel.select()
        .from(USERS.NAME)
        .where(`${USERS.COLUMNS.ID} = '${id}'`)
        .toString()
}