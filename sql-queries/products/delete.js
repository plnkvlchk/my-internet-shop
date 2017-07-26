import { PRODUCTS } from '../../constants'
import squel from 'squel'
import { getWhereClause } from '../helpers'

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

export function deleteProductsByIdsQuery(ids) {
    return squelPostgres.delete()
        .from(PRODUCTS.NAME)
        .where(getWhereClause({
            [PRODUCTS.COLUMNS.ID]: ids
        }))
        .returning('*')
        .toString()
}
