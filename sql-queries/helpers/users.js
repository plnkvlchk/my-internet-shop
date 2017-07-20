import squel from 'squel'
import { USERS } from '../../constants'
import _ from 'lodash'

export function getUsersByConditions(conditions) {
    let whereClause = ''
    _.forEach(conditions, (value, key) => {
        whereClause += `${key} = '${value}' OR `
    })
    whereClause = whereClause.substr(0, whereClause.length - 4)

    return squel.select()
        .from(USERS.NAME)
        .where(whereClause)
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
    let whereClause = ''
    ids.forEach((item) => {
        whereClause += `${USERS.COLUMNS.ID} = '${item}' OR `
    } )
    // SEEMS TO BE A VERY VERY BAD SOLUTION
    whereClause = whereClause.substr(0, whereClause.length - 4)

    return squel.select()
        .from(USERS.NAME)
        .field(USERS.COLUMNS.ID)
        .where(whereClause)
        .toString()
}
