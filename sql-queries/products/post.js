import squel from 'squel'
import { PRODUCTS } from '../../constants'

export function addProductQuery(values) {
    if (values.id) {
        return squel.insert()
            .into(PRODUCTS.NAME)
            .set(PRODUCTS.COLUMNS.NAME, values.name)
            .set(PRODUCTS.COLUMNS.PRICE, values.price)
            .set(PRODUCTS.COLUMNS.ID, values.id)
            .toString()
    } else {
        console.log('without id')
        return squel.insert()
            .into(PRODUCTS.NAME)
            .set(PRODUCTS.COLUMNS.NAME, values.name)
            .set(PRODUCTS.COLUMNS.PRICE, values.price)
            .toString()
    }
}


