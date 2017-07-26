import _ from 'lodash'

// takes an object where key = nameOfProperty , value = array of this property's values
export function getWhereClause(conditions) {
    let conditionsArray =[]
    _.forEach(conditions, (value, key) => {
        _.forEach(value, (item) => {
            conditionsArray.push(`${key} = '${item}'`)
        })
    })
    return _.join(conditionsArray, ' OR ')
}
