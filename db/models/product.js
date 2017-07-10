//TODO: jsdoc
//TODO: eslint
export default function Product(product) {

    this.name = product.name || 'default name' //TODO: throw exception if name not passed
    this.price = product.price || 'default price' //TODO: throw exception if name not passed
    this.id = product.id || (new Date().getTime() + Math.random()).toString() //TODO: check pattern of id

}
