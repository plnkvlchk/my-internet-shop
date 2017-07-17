import squel from 'squel'
import { USERS } from '../../constants/tables'

const squelPostgres = squel.useFlavour('postgres')

export function addUserQuery(values) {
    if (values.id) {
        return squelPostgres.insert()
            .into(USERS.NAME)
            .set(USERS.COLUMNS.NAME, values.name)
            .set(USERS.COLUMNS.LOGIN, values.login)
            .set(USERS.COLUMNS.ID, values.id)
            .returning('*')
            .toString()
    } else {
        return squelPostgres.insert()
            .into(USERS.NAME)
            .set(USERS.COLUMNS.NAME, values.name)
            .set(USERS.COLUMNS.LOGIN, values.login)
            .returning('*')
            .toString()
    }
}
