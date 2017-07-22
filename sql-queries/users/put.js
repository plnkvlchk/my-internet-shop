import squel from 'squel'
import { USERS } from '../../constants/tables'

const squelPostgres = squel.useFlavour('postgres')

export function updateUserByIdQuery(id, values) {
    return squelPostgres.update()
        .table(USERS.NAME)
        .setFields(values)
        .where(`${USERS.COLUMNS.ID} = '${id}'`)
        .returning('*')
        .toString()
}
