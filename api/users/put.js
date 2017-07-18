import * as responseHelpers from '../../helpers/response'
import { types, operations, errors } from '../constants'
import { updateUserByIdQuery, getUserByIdQuery } from '../../sql-queries'
import { oneOrNone, manyOrNone } from '../../db'
import _ from 'lodash'
import { getUsersWithThisIdOrLoginQuery } from '../../sql-queries/helpers'
import { USERS } from '../../constants'

export async function updateUserById(req, res) {
    let result
    let status = 400

    delete req.body['id']
    _.forEach(_.keys(req.body), item => {
        if (_.values(USERS.COLUMNS).indexOf(item) === -1) {
            delete req.body[item]
        }
    })

    const similarRows = await manyOrNone(getUsersWithThisIdOrLoginQuery(req.params.userId, req.body.login))
    const userWithSameId = _.filter(similarRows, (item) => item.id === req.params.userId)
    const userWithSameLogin = _.filter(similarRows, (item) => item.id === req.params.login)

    if (_.isEmpty(userWithSameId)) {
        result = responseHelpers.getFailureResponse(operations.PUT, types.USER, errors.NOT_EXISTS, {
            "id": req.params.userId
        })
        return res.status(status).json(result)
    }

    if (_.isEmpty(req.body)) {
        const currentUser = await oneOrNone(getUserByIdQuery(req.params.userId))
        result = responseHelpers.getSuccessResponse(operations.PUT, currentUser, types.USER)
        status = 200
        return res.status(status).json(result)
    }

    if (_.isEmpty(userWithSameLogin) || userWithSameLogin[0] === userWithSameId.id) {
        const dataFromPostgres = await oneOrNone(updateUserByIdQuery(req.params.userId, req.body))
        result = responseHelpers.getSuccessResponse(operations.PUT, dataFromPostgres, types.USER)
        status = 200
        return res.status(status).json(result)
    }

    result = responseHelpers.getFailureResponse(operations.PUT, types.LOGIN, errors.NOT_UNIQUE, {
        "login": req.body.login
    })
    return res.status(status).json(result)
}
