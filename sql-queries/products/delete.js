import { PRODUCTS } from '../../constants'
import { CATALOG } from '../../constants'
import squel from 'squel'

const squelPostgres = squel.useFlavour('postgres')

export function deleteProductByIdQuery(id) {
    return squelPostgres.delete()
        .from(PRODUCTS.NAME)
        .where(`${PRODUCTS.COLUMNS.ID} = '${id}'`)
        .returning('*')
        .toString()
}

export function deleteAllProductsQuery() {
    return squelPostgres.delete()
        .from(PRODUCTS.NAME)
        .returning('*')
        .toString()
}

export function deleteProductsUsersQuery(id) {
    return squelPostgres.delete()
        .from(CATALOG.NAME)
        .where(`${CATALOG.COLUMNS.PRODUCT_ID} = '${id}'`)
        .returning('*')
        .toString()
}
