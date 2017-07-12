export default function Product(product) {
    if (!product.name) {
        throw new ReferenceError('name')
    }
    if (!product.price) {
        throw new ReferenceError('price')
    }

    this.name = product.name
    this.price = product.price
    this.id = product.id.toString() || (new Date().getTime() + Math.random()).toString() //TODO: check pattern of id
}
