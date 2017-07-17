export default function Product(product) {
    if (!product.name) {
        throw new ReferenceError('name')
    }
    if (!product.price) {
        throw new ReferenceError('price')
    }

    this.name = product.name
    this.price = product.price

    if(product.id) {
        this.id = product.id.toString()
    }

    //TODO: check pattern of id
}
