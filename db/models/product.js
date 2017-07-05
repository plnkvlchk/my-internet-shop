export default function Product(product) {

    this.name = product.name || 'default name'
    this.price = product.price || 'default price'
    this.id = product.id || (new Date().getTime() + Math.random()).toString()

}
