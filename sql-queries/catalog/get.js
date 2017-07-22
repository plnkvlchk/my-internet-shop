import { CATALOG } from '../../constants'
import squel from 'squel'

export function getUsersRelationsQuery(user_id) {
    return squel.select()
        .from(CATALOG.NAME)
        .where(`${CATALOG.COLUMNS.USER_ID} = '${user_id}'`)
        .toString()
}

export function getProductsRelationsQuery(product_id) {
    return squel.select()
        .from(CATALOG.NAME)
        .where(`${CATALOG.COLUMNS.PRODUCT_ID} = '${product_id}'`)
        .toString()
}
