import _ from 'lodash'
import { USERS } from '../constants'

export function isValuesValid(values) {
    if (!_.isString(values[USERS.COLUMNS.LOGIN])) {
        throw new TypeError(USERS.COLUMNS.LOGIN)
    }

    if (!_.isString(values[USERS.COLUMNS.NAME])) {
        throw new TypeError(USERS.COLUMNS.NAME)
    }
}
