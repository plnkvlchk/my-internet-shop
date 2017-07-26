import * as responseHelpers from '../../helpers/response'
import {
    OPERATION_TYPES,
    ERRORS_DESCRIPTIONS
} from '../constants'
import {
    manyOrNone,
    oneOrNone
} from '../../db'
import {
    getAllUsersQuery,
    getUserByIdQuery,
    getUsersRelationsQuery
} from '../../sql-queries'
import {
    USERS,
    CATALOG
} from '../../constants'
import { isValidUUID } from '../../helpers/catalog'

export async function getAll(req, res) {
    const users = await manyOrNone(getAllUsersQuery())
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.GET, users))
}

export async function getUserById(req, res) {
    if (!isValidUUID(req.params.userId)) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.GET, USERS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.WRONG_TYPE, {
                [USERS.COLUMNS.ID]: req.params.userId
            }))
    }

    const user = await oneOrNone(getUserByIdQuery(req.params.userId))

    if (user) {
        return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.GET, user))
    } else {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.GET, USERS.COLUMNS.ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [USERS.COLUMNS.ID]: req.params.userId
            }))
    }
}

export async function getUsersProducts(req, res) {
    if (!isValidUUID(req.params.userId)) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.GET, CATALOG.COLUMNS.USER_ID,
            ERRORS_DESCRIPTIONS.WRONG_TYPE, {
                [CATALOG.COLUMNS.USER_ID]: req.params.userId
            }))
    }

    const user = await oneOrNone(getUserByIdQuery(req.params.userId))
    if (!user) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.GET, CATALOG.COLUMNS.USER_ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [CATALOG.COLUMNS.USER_ID]: req.params.userId
            }))
    }

    const relations = await manyOrNone(getUsersRelationsQuery(req.params.userId))
    return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.GET, relations))
}
