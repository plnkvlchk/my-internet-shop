import { PRODUCTS } from '../../constants'
import squel from 'squel'
import { getWhereClause } from './sql-strings'

export function getProductsIdsQuery(ids) {
    return squel.select()
        .from(PRODUCTS.NAME)
        .field(PRODUCTS.COLUMNS.ID)
        .where(getWhereClause({
            [PRODUCTS.COLUMNS.ID]: ids
        }))
        .toString()
}

export function getAllProductsIdsQuery() {
    return squel.select()
        .from(PRODUCTS.NAME)
        .field(PRODUCTS.COLUMNS.ID)
        .toString()
}
