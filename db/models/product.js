import { PRODUCTS } from '../../constants'

export default function Product(product) {
    const uuidPattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

    if (!product.name) {
        throw new ReferenceError(PRODUCTS.COLUMNS.NAME)
    }
    if (!product.price) {
        throw new ReferenceError(PRODUCTS.COLUMNS.PRICE)
    }
    if (product.id && !uuidPattern.test(product.id)) {
        throw new TypeError(PRODUCTS.COLUMNS.ID)
    }

    this.name = product.name
    this.price = product.price

    if(product.id && uuidPattern.test(product.id)) {
        this.id = product.id.toString()
    }
}
