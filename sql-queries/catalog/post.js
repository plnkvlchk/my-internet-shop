import squel from 'squel'
import { CATALOG } from '../../constants'

const squelPostgres = squel.useFlavour('postgres')

export function addUsersProductsQuery(userId, productsIds) {
    let values = []
    productsIds.forEach((item) => values.push( {
        user_id: userId,
        product_id: item
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
        product_id: productId,
        user_id: item
    }))

    return squelPostgres.insert()
        .into(CATALOG.NAME)
        .setFieldsRows(values)
        .returning('*')
        .toString()
}
