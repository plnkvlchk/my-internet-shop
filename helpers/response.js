//TODO: jsdoc
//TODO: eslint
//TODO: helpers must not be exported as defaults
export default function getResponse(success, operationType, info, elementType, data) {
    if (success) {
        //TODO: objects should look like this according to eslint
        return {
            success: true
        }
    } else {
        return {success: false, error: {message: "Cannot " + operationType + " element", info: info, //TODO: use es6 templates
            elementType: elementType, data: data}}
    }
}
