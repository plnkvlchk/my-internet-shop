import squel from 'squel'
import {USERS} from '../../constants/tables'

const squelPostgres = squel.useFlavour('postgres')

export function deleteUserByIdQuery(id) {
    return squelPostgres.delete()
        .from(USERS.NAME)
        .where(`${USERS.COLUMNS.ID} = '${id}'`)
        .returning('*')
        .toString()
}

export function deleteAllUsersQuery() {
    return squelPostgres.delete()
        .from(USERS.NAME)
        .returning('*')
        .toString()
}
