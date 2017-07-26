import squel from 'squel'
import {USERS} from '../../constants/tables'
import { getWhereClause } from '../helpers'

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

export function deleteUsersByIdsQuery(ids) {
    return squelPostgres.delete()
        .from(USERS.NAME)
        .where(getWhereClause({
            [USERS.COLUMNS.ID]: ids
        }))
        .returning('*')
        .toString()
}
