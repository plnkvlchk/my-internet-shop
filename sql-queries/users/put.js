import squel from 'squel'
import { USERS } from '../../constants/tables'

export function updateUserByIdQuery(id, values) {
    return squel.update()
        .table(USERS.NAME)
        .set(USERS.COLUMNS.LOGIN, values.login)
        .set(USERS.COLUMNS.NAME, values.name)
        .where(`${USERS.COLUMNS.ID} = '${id}'`)
        .toString()
}
