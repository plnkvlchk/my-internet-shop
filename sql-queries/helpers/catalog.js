import squel from 'squel'
import { CATALOG } from '../../constants'

export function deleteUsersDependenciesQuery(id) {
    return squel.delete()
        .from(CATALOG.NAME)
        .where(`${CATALOG.COLUMNS.USER_ID} = '${id}'`)
        .toString()
}

export function deleteProductsDependenciesQuery(id) {
    return squel.delete()
        .from(CATALOG.NAME)
        .where(`${CATALOG.COLUMNS.PRODUCT_ID} = '${id}'`)
        .toString()
}
