import squel from 'squel'
import { USERS } from '../../constants/tables'

const squelPostgres = squel.useFlavour('postgres')

export function addUserQuery(values) {
    if (values.id) {
        return squelPostgres.insert()
            .into(USERS.NAME)
            .setFields({
                [USERS.COLUMNS.NAME]: values.name,
                [USERS.COLUMNS.LOGIN]: values.login,
                [USERS.COLUMNS.ID]: values.id
            })
            .returning('*')
            .toString()
    } else {
        return squelPostgres.insert()
            .into(USERS.NAME)
            .setFields({
                [USERS.COLUMNS.NAME]: values.name,
                [USERS.COLUMNS.LOGIN]: values.login
            })
            .returning('*')
            .toString()
    }
}

export function addUsersQuery(values) {
    return squelPostgres.insert()
        .into(USERS.NAME)
        .setFieldsRows(values)
        .returning('*')
        .toString()
}
