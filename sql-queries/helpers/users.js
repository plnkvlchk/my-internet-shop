import squel from 'squel'
import { USERS } from '../../constants'
import { getWhereClause } from './sql-strings'

export function getUsersByConditions(conditions) {
    return squel.select()
        .from(USERS.NAME)
        .where(getWhereClause(conditions))
        .toString()
}

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

export function getUsersIdsQuery(ids) {
    return squel.select()
        .from(USERS.NAME)
        .field(USERS.COLUMNS.ID)
        .where(getWhereClause({
            [USERS.COLUMNS.ID]: ids
        }))
        .toString()
}
