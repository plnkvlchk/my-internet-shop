// export default function User(name = "default name", login, id) {
//
//     this.name = name
//     this.login = login
//     this.id = (id || (new Date().getTime() + Math.random())).toString()
//
// }

export default function User(user) {
    this.name = user.name || 'default name'
    this.login = user.login
    this.id = user.id || (new Date().getTime() + Math.random()).toString()
}





