import { PRODUCTS } from '../../constants'
import { isUuidValueCorrect } from '../../helpers/catalog'

export default function Product(product) {
    if (!product.name) {
        throw new ReferenceError(PRODUCTS.COLUMNS.NAME)
    }
    if (!product.price) {
        throw new ReferenceError(PRODUCTS.COLUMNS.PRICE)
    }
    if (product.id && !(isUuidValueCorrect(product.id))) {
        throw new TypeError(PRODUCTS.COLUMNS.ID)
    }

    this.name = product.name
    this.price = product.price

    if(product.id) {
        this.id = product.id.toString()
    }
}
