import _ from 'lodash'

export function getWhereClause(conditions) {
    let conditionsArray =[]
    _.forEach(conditions, (value, key) => {
        _.forEach(value, (item) => {
            conditionsArray.push(`${key} = '${item}'`)
        })
    })
    return _.join(conditionsArray, ' OR ')
}
