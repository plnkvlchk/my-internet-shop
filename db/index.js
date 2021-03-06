import pgPromise from 'pg-promise'

const pgp = pgPromise()
const dbUrl = 'postgres://postgres:gfkbif13@localhost:5432/mydb1'

const db = pgp(dbUrl)

export function oneOrNone(query) {
    return db.oneOrNone(query)
}

export function manyOrNone(query) {
    return db.manyOrNone(query)
}

export function remove(query) {
    return db.query(query)
}

export function insert(query) {
    return db.query(query)
}

export function update(query) {
    return db.query(query)
}
