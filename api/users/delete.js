import * as user from '../../db/tables/user.js'
import * as catalog from '../../db/tables/catalog.js'
import * as helpers from '../../helpers/user.js'
import getResponse from '../../helpers/response'
import * as catalogHelpers from '../../helpers/catalog'


export function deleteUserById(req, res) {
    if (helpers.isUserExists(user.getUsers(), req.params.userId)) {
        return res.status(200).json({response: getResponse(true), result: user.deleteUserById(req.params.userId)})
    } else {
        return res.status(400).json({response: getResponse(false, "delete",
            "Element with id " + req.params.userId + " does not exist", "user")})
    }
}

export function deleteAllUsers(req, res) {
    return res.status(200).json({response: getResponse(true), result: user.deleteAllUsers()})
}

export function deleteRelationByIds(req, res) {
    if (!helpers.isUserExists(user.getUsers(), req.params.userId)) {
        return res.status(400).json({response: getResponse(false, "delete relation of the",
            "Element with id " + req.params.userId + " does not exist", "user")})
    }

    if (!catalogHelpers.isRelationExists(catalog.getCatalog(), req.params.userId, req.params.productId)) {
        return res.status(400).json({response: getResponse(false, "delete relation of the",
            "This element does not exist", "relation")})
    }

    return res.status(200).json({response: getResponse(true),
        result: catalog.deleteRelation(req.params.userId, req.params.productId)})

}

export function deleteUsersRelations(req, res) {
    if (!helpers.isUserExists(user.getUsers(), req.params.userId)) {
        return res.status(400).json({response: getResponse(false, "delete relation of the",
            "Element with id " + req.params.userId + " does not exist", "user")})
    }
    let deleted = []
    catalog.getUserProducts(user.getUserById(req.params.userId)).forEach((item) =>
        deleted.push(catalog.deleteRelation(req.params.userId, item)))
    return res.status(200).json({response: getResponse(true),
        result: deleted})
}




