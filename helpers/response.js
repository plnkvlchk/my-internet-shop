export default function getResponse(success, operationType, info, elementType, data) {
    if (success) {
        return {success: true}
    } else {
        return {success: false, error: {message: "Cannot " + operationType + " element", info: info,
            elementType: elementType, data: data}}
    }
}
