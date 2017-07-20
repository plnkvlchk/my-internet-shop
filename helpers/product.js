import _ from 'lodash'
import { PRODUCTS } from '../constants'

export function isValuesValid(values) {
    if (!_.isString(values[PRODUCTS.COLUMNS.NAME])) {
        throw new TypeError(PRODUCTS.COLUMNS.NAME)
    }

    if (!_.isNumber(values[PRODUCTS.COLUMNS.PRICE])) {
        throw new TypeError(PRODUCTS.COLUMNS.PRICE)
    }
}


