import squel from 'squel'
import { PRODUCTS } from '../../constants'

export function getAllProductsQuery() {
    return squel.select()
        .from(PRODUCTS.NAME)
        .toString()
}

export function getProductByIdQuery(id) {
    return squel.select()
        .from(PRODUCTS.NAME)
        .where(`${PRODUCTS.COLUMNS.ID} = '${id}'`)
        .toString()
}