import * as responseHelpers from '../../helpers/response'
import {
    OPERATION_TYPES,
    ERRORS_DESCRIPTIONS
} from '../constants'
import {
    updateUserByIdQuery,
    getUserByIdQuery,
    getUsersByConditions
} from '../../sql-queries'
import { oneOrNone,
    manyOrNone,
    update
} from '../../db'
import _ from 'lodash'
import { USERS } from '../../constants'
import { isValuesValid } from '../../helpers/user'

export async function updateUserById(req, res) {
    let newValues = {}
    _.forEach(USERS.COLUMNS, (value) => {
        if (!(value === USERS.COLUMNS.ID) && req.body[value] ) {
            newValues[value] = req.body[value]
        }
    })

    try {
        isValuesValid(newValues)
    } catch (err) {
        return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.PUT, err.message,
            ERRORS_DESCRIPTIONS.WRONG_TYPE, {
                [err.message]: newValues[err.message]
            }))
    }

    const similarRows = await manyOrNone(getUsersByConditions({
        [USERS.COLUMNS.ID]: [req.params.userId],
        [USERS.COLUMNS.LOGIN]: [newValues[USERS.COLUMNS.LOGIN]]
    }))

    const userWithSameId = _.filter(similarRows, (item) => item[USERS.COLUMNS.ID] === req.params.userId)
    const userWithSameLogin = _.filter(similarRows, (item) => item[USERS.COLUMNS.LOGIN] === newValues[USERS.COLUMNS.LOGIN])

    if (_.isEmpty(userWithSameId)) {
        return res.status(400).json(OPERATION_TYPES.PUT, USERS.COLUMNS.ID, ERRORS_DESCRIPTIONS.NOT_EXISTS, {
            [USERS.COLUMNS.ID]: req.params.userId
        })
    }

    if (_.isEmpty(newValues)) {
        const user = await oneOrNone(getUserByIdQuery(req.params.userId))
        return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.PUT, user))
    }

    if (_.isEmpty(userWithSameLogin) || userWithSameLogin[0] === userWithSameId.id) {
        const userUpdated = await update(updateUserByIdQuery(req.params.userId, newValues))
        return res.status(200).json(responseHelpers.getSuccessResponse(OPERATION_TYPES.PUT, userUpdated))
    }

    return res.status(400).json(responseHelpers.getFailureResponse(OPERATION_TYPES.PUT, USERS.COLUMNS.LOGIN,
        ERRORS_DESCRIPTIONS.NOT_UNIQUE, {
            [USERS.COLUMNS.LOGIN]: req.body.login
        }))
}
