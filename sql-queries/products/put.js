import { PRODUCTS } from '../../constants'
import squel from 'squel'

export function updateProductByIdQuery(id, values) {
    return squel.update()
        .table(PRODUCTS.NAME)
        .set(PRODUCTS.COLUMNS.NAME, values.name)
        .set(PRODUCTS.COLUMNS.PRICE, values.price)
        .where(`${PRODUCTS.COLUMNS.ID} = '${id}'`)
        .toString()
}
