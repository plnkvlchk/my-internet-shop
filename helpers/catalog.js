import _ from 'lodash'

export function isValidUUID(value) {
    const uuidPattern = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    return uuidPattern.test(value)
}

export function getIdsNotExisting(idsFromRequest, idsFromPostgres) {
    let idsNotExisting = []
    if (idsFromPostgres.length < idsFromRequest.length) {
        const map = _.reduce(idsFromPostgres, (acc, item) => {
            acc[item] = true
            return acc
        }, {})
        idsNotExisting = _.filter(idsFromRequest, id => !map[id])
    }
    return idsNotExisting
}

export function getIdsRelated(idsFromRequest, idsFromPostgres) {
    const map = _.reduce(idsFromPostgres, (acc, item) => {
        acc[item] = true
        return acc
    }, {})
    const idsRelated = _.filter(idsFromRequest, id => map[id])
    return idsRelated
}
