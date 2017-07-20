import _ from 'lodash'

export function getIdsNotExisting(idsFromRequest, idsFromPostgres) {
    let idsNotExisting = []
    if (idsFromPostgres.length < idsFromRequest.length) {
        console.log('entered here u stupid')
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
