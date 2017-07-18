import { PRODUCTS } from '../../constants'
import squel from 'squel'

const squelPostgres = squel.useFlavour('postgres')

export function updateProductByIdQuery(id, values) {
    return squelPostgres.update()
        .table(PRODUCTS.NAME)
        .setFields(values)
        .where(`${PRODUCTS.COLUMNS.ID} = '${id}'`)
        .returning('*')
        .toString()
}
