import { PRODUCTS } from '../../constants'
import squel from 'squel'

export function getProductsIdsQuery(ids) {
    let whereClause = ''
    ids.forEach((item) => {
        whereClause += `${PRODUCTS.COLUMNS.ID} = '${item}' OR `
    } )
    // SEEMS TO BE A VERY VERY BAD SOLUTION
    whereClause = whereClause.substr(0, whereClause.length - 4)

    return squel.select()
        .from(PRODUCTS.NAME)
        .field(PRODUCTS.COLUMNS.ID)
        .where(whereClause)
        .toString()
}
