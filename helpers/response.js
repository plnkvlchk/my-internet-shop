export function getSuccessResponse(operation, data) {
    return {
        success: true,
        operation: operation,
        data: data
    }
}

export function getFailureResponse(operation, propertyInvalid, errorName, data) {
    return {
        success: false,
        message: `Cannot ${operation} element`,
        error: `${propertyInvalid} ${errorName}.`,
        data: data
    }
}
