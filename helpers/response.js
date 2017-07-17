export function getSuccessResponse(operationType, data, dataType) {
    return Object.assign({
        success: true,
        operation: operationType
    }, {
        dataType: dataType,
        data: data
    })
}

export function getFailureResponse(operationType, invalidProperty, errorName, data) {
    return {
        success: false,
        message: `Cannot ${operationType} element`,
        error: `${invalidProperty} ${errorName}.`,
        data: data
    }
}
