import squel from 'squel'
import { PRODUCTS } from '../../constants'

const squelPostgres = squel.useFlavour('postgres')

export function addProductQuery(values) {
    if (values.id) {
        return squelPostgres.insert()
            .into(PRODUCTS.NAME)
            .setFields({
                [PRODUCTS.COLUMNS.NAME]: values.name,
                [PRODUCTS.COLUMNS.PRICE]: values.price,
                [PRODUCTS.COLUMNS.ID]: values.id
            })
            .returning('*')
            .toString()
    } else {
        return squelPostgres.insert()
            .into(PRODUCTS.NAME)
            .setFields({
                [PRODUCTS.COLUMNS.NAME]: values.name,
                [PRODUCTS.COLUMNS.PRICE]: values.price
            })
            .returning('*')
            .toString()
    }
}
