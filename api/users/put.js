import * as user from '../../db/tables/user.js'
import * as helpers from '../../helpers/user.js'
import getResponse from '../../helpers/response' //TODO: helpers must not be exported as defaults
//TODO: apply all objections from this file to all files nested it 'api/' folder
//TODO: jsdoc
//TODO: eslint
export function updateUserById(req, res) {
    let users = user.getUsers()

    if (!helpers.isUserExists(users, req.params.userId)) {
        return res.status(400).json({response: //TODO: json method takes the body of your future response, so there is no need in additional sibling
            getResponse(false, "update"//TODO: this property must be moved to constants
            , "Element with id " + req.params.userId + " does not exist" //TODO: use es6 templates here
            , "user")})
    }

    let currentUser = user.getUserById(req.params.userId)

    if ((!helpers.isUserLoginUnique(users, req.body.login)) && !(currentUser.login === req.body.login)) {
        return res.status(400).json({response: getResponse(false, "update",
            "Input 'LOGIN' is not unique"//TODO: use es6 template here names of properties must be moved to constants
        )})
    }

    //TODO just delete id
    let newProperties = req.body
    if (newProperties.id) {
        delete newProperties["id"]
    }

    return res.status(200).json({response: getResponse(true),
        result: user.updateUserById(req.params.userId, newProperties //TODO don't be lazy! create separate object for response
        )})//TODO: is async operation, but we will discuss it lalte
}



