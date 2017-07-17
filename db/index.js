import pgPromise from 'pg-promise'

const pgp = pgPromise()
const dbUrl = 'postgres://postgres:gfkbif13@localhost:5432/mydb1'

const db = pgp(dbUrl)

export function query(query) {
    return db.query(query)
}

export function insert(query) {
    return db.many(query + 'RETURNING *')
}

export function oneOrNone(query) {
    return db.oneOrNone(query)
}

export function manyOrNone(query) {
    return db.manyOrNone(query)
}

export function oneOrNoneReturning(query) {
    return db.oneOrNone(query + 'RETURNING *')
}

export function remove(query) {
    return db.oneOrNone(query + 'RETURNING *')
}

export function update(query) {
    return db.oneOrNone(query + 'RETURNING *')
}

// export function one(query) {
//     return db.one(query)
// }

// export function insert(table, columns, values) {
//     const cs = new pgp.helpers.ColumnSet(columns, {table})
//     const query = pgp.helpers.insert(values, cs)
//
//     return db.many(query + 'RETURNING *')
// }
