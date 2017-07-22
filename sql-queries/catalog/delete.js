import { CATALOG } from '../../constants'
import squel from 'squel'

const squelPostgres = squel.useFlavour('postgres')

export function deleteRelationByIdsQuery(user_id, product_id) {
    return squelPostgres.delete()
        .from(CATALOG.NAME)
        .where(`${CATALOG.COLUMNS.USER_ID} = '${user_id}'`)
        .where(`${CATALOG.COLUMNS.PRODUCT_ID} = '${product_id}'`)
        .returning('*')
        .toString()
}

export function deleteUsersProductsQuery(user_id) {
    return squelPostgres.delete()
        .from(CATALOG.NAME)
        .where(`${CATALOG.COLUMNS.USER_ID} = '${user_id}'`)
        .returning('*')
        .toString()
}

export function deleteProductsRelationsQuery(product_id) {
    return squelPostgres.delete()
        .from(CATALOG.NAME)
        .where(`${CATALOG.COLUMNS.PRODUCT_ID} = '${product_id}'`)
        .returning('*')
        .toString()
}
