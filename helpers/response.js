import _ from 'lodash'

export function getSuccessResponse(operation, data, dataType) {
    return _.assign({
        success: true,
        operation: operation
    }, {
        dataType: dataType,
        data: data
    })
}

export function getFailureResponse(operation, propertyInvalid, errorName, data) {
    return {
        success: false,
        message: `Cannot ${operation} element`,
        error: `${propertyInvalid} ${errorName}.`,
        data: data
    }
}
