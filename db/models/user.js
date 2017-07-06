//TODO: jsdoc
//TODO: eslint
//TODO: comments
// export default function User(name = "default name", login, id) {
//
//     this.name = name
//     this.login = login
//     this.id = (id || (new Date().getTime() + Math.random())).toString()
//
// }

export default function User(user) {
    this.name = user.name || 'default name' //TODO: throw exception if name not passed
    this.login = user.login //TODO: check login
    this.id = user.id || (new Date().getTime() + Math.random()).toString() //TODO: check pattern of id
}





