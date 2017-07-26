import squel from 'squel'
import { CATALOG } from '../../constants'

const squelPostgres = squel.useFlavour('postgres')

export function addUsersProductsQuery(userId, productsIds) {
    let values = []
    productsIds.forEach((item) => values.push( {
        [CATALOG.COLUMNS.USER_ID]: userId,
        [CATALOG.COLUMNS.PRODUCT_ID]: item
    }))

    return squelPostgres.insert()
        .into(CATALOG.NAME)
        .setFieldsRows(values)
        .returning('*')
        .toString()
}

export function addProductsUsersQuery(productId, usersIds) {
    let values = []
    usersIds.forEach((item) => values.push( {
        [CATALOG.COLUMNS.PRODUCT_ID]: productId,
        [CATALOG.COLUMNS.USER_ID]: item
    }))

    return squelPostgres.insert()
        .into(CATALOG.NAME)
        .setFieldsRows(values)
        .returning('*')
        .toString()
}
