import * as responseHelpers from '../../helpers/response'
import { types } from '../constants'
import { operations } from '../constants'
import { errors } from '../constants'
import { updateUserByIdQuery } from '../../sql-queries'
import { oneOrNoneReturning, manyOrNone } from '../../db'
import _ from 'lodash'
import { getUsersWithThisIdOrLoginQuery } from '../../sql-queries/helpers'

export async function updateUserById(req, res) {
    let result
    let status = 400

    const similarRows = await manyOrNone(getUsersWithThisIdOrLoginQuery(req.params.userId, req.body.login))
    const userWithSameId = _.filter(similarRows, (item) => item.id === req.params.userId)
    const userWithSameLogin = _.filter(similarRows, (item) => item.id === req.params.login)

    if (_.isEmpty(userWithSameId)) {
        result = responseHelpers.getFailureResponse(operations.PUT, types.USER, errors.NOT_EXISTS, {
            "id": req.params.userId
        })
        return res.status(status).json(result)
    }

    if (_.isEmpty(userWithSameLogin) || userWithSameLogin[0] === userWithSameId.id) {
        const dataFromPostgres = await oneOrNoneReturning(updateUserByIdQuery(req.params.userId, req.body))
        result = responseHelpers.getSuccessResponse(operations.PUT, dataFromPostgres, types.USER)
        status = 200
        return res.status(status).json(result)
    }

    result = responseHelpers.getFailureResponse(operations.PUT, types.LOGIN, errors.NOT_UNIQUE, {
        "login": req.body.login
    })
    return res.status(status).json(result)
}
