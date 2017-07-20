import * as responseHelpers from '../../helpers/response'
import {
    OPERATION_TYPES,
    ERRORS_DESCRIPTIONS
} from '../constants'
import {
    deleteUserByIdQuery,
    getUserByIdQuery,
    deleteRelationByIdsQuery,
    deleteUsersProductsQuery,
    deleteAllUsersQuery
} from '../../sql-queries'
import {
    oneOrNone,
    remove
} from '../../db'
import { deleteUsersDependenciesQuery } from '../../sql-queries/helpers'
import {
    USERS,
    CATALOG
} from '../../constants'

export async function deleteUserById(req, res) {
    const user = await oneOrNone(getUserByIdQuery(req.params.userId))
    if(!user) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.DELETE, USERS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [USERS.COLUMNS.ID]: req.params.userId
            }))
    }

    await remove(deleteUsersDependenciesQuery(req.params.userId))
    const userDeleted = await remove(deleteUserByIdQuery(req.params.userId))
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.DELETE, userDeleted))
}

export async function deleteAllUsers(req, res) {
    const usersDeleted = await remove(deleteAllUsersQuery())
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.DELETE, usersDeleted))
}

export async function deleteRelationByIds(req, res) {
    const user = await oneOrNone(getUserByIdQuery(req.params.userId))
    if (!user) {
        return res.status(400).json(OPERATION_TYPES.DELETE, CATALOG.COLUMNS.USER_ID, ERRORS_DESCRIPTIONS.NOT_EXISTS, {
            [CATALOG.COLUMNS.USER_ID]: req.params.userId
        })
    }

    const relationDeleted = await remove(deleteRelationByIdsQuery(req.params.userId, req.params.productId))
    if (!relationDeleted) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.DELETE,
            [CATALOG.COLUMNS.USER_ID, CATALOG.COLUMNS.PRODUCT_ID], ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [CATALOG.COLUMNS.USER_ID]: req.params.userId,
                [CATALOG.COLUMNS.PRODUCT_ID]: req.params.productId
            }))
    }

    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.DELETE, relationDeleted))
}

export async function deleteUsersRelations(req, res) {
    const user = await oneOrNone(getUserByIdQuery(req.params.userId))
    if (!user) {
        return res.status(400).json(OPERATION_TYPES.DELETE, CATALOG.COLUMNS.USER_ID, ERRORS_DESCRIPTIONS.NOT_EXISTS, {
            [CATALOG.COLUMNS.USER_ID]: req.params.userId
        })
    }

    const relationsDeleted = await remove(deleteUsersProductsQuery(req.params.userId))

    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.DELETE, relationsDeleted))
}
