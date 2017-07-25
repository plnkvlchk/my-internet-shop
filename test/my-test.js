import chai from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../index'
import { getAllUsersRoute, getUserByIdRoute } from './helpers'
import {
    insert,
    remove,
    oneOrNone,
    manyOrNone
} from '../db'
import {
    addUserQuery,
    deleteUserByIdQuery,
    getUserByIdQuery,
    getAllUsersQuery
} from '../sql-queries'
import { getSuccessResponse, getFailureResponse } from '../helpers/response'
import { OPERATION_TYPES, ERRORS_DESCRIPTIONS } from '../api/constants'
import { USERS } from '../constants'
import { ROUTES } from '../api/constants/routes'

const should = chai.should()

chai.use(chaiHttp)

describe('GET /users', () => {
    it('returns success response', async () => {
        const initialSelect = await manyOrNone(getAllUsersQuery())
        const initialGet = await chai.request(app).get(getAllUsersRoute())
        initialGet.body.should.have.property('data').that.is.an('array')
        initialGet.body.data.should.deep.equal(initialSelect)

        const newUsers = [{
            "name": "test_name_1",
            "login": "test_login_1",
            "id": "d88f09c3-49df-4a93-b15c-c685f3b557d1"
        }, {
            "name": "test_name_2",
            "login": "test_login_2",
            "id": "d88f09c3-49df-4a93-b15c-c685f3b557d2"
        }, {
            "name": "test_name_3",
            "login": "test_login_3",
            "id": "d88f09c3-49df-4a93-b15c-c685f3b557d3"
        }]
        newUsers.forEach(async (newUser) => await insert(addUserQuery(newUser)))

        const response = await chai.request(app).get(getAllUsersRoute())
        response.body.should.have.property('data').that.is.an('array')
        console.log(initialSelect.concat(newUsers))
        response.body.data.should.deep.equal(initialSelect.concat(newUsers))

        // TODO: write a query for multiple deletion
        newUsers.forEach(async (newUser) => await remove(deleteUserByIdQuery(newUser.id)))

        const finalSelect = await manyOrNone(getAllUsersQuery())
        const finalGet = await chai.request(app).get(getAllUsersRoute())
        finalGet.body.should.have.property('data').that.is.an('array')
        finalGet.body.data.should.deep.equal(finalSelect)
        // response.should.deep.equal(expectedResult)
    })
})

describe(`GET ${ROUTES.USERS.BASE + ROUTES.USERS.ID}`, () => {

    it('returns failure response, id has wrong type', (done) => {
        const idInvalid = '123'
        const expectedResult = getFailureResponse(OPERATION_TYPES.GET, USERS.COLUMNS.ID, ERRORS_DESCRIPTIONS.WRONG_TYPE, {
            [USERS.COLUMNS.ID]: idInvalid
        })

        chai.request(app)
            .get(getUserByIdRoute(idInvalid))
            .end((err, res) => {
                res.body.should.deep.equal(expectedResult)
                done()
            })
    })

    it('returns failure response, id does not exist', (done) => {
        const idNotExisting = '0c7e2499-6f50-41e5-9b49-087d87f462b3'
        const expectedResult = getFailureResponse(OPERATION_TYPES.GET, USERS.COLUMNS.ID, ERRORS_DESCRIPTIONS.NOT_EXISTS, {
            id: idNotExisting
        })

        chai.request(app)
            .get(getUserByIdRoute(idNotExisting))
            .end((err, res) => {
                res.body.should.deep.equal(expectedResult)
                done()
            })
    })

    it('returns success response, data ', async () => {
        const newUser = {
            name: "test_name",
            login: "test_login_1",
            id: "d88f09c3-49df-4a93-b15c-c685f3b557d5"
        }

        await insert(addUserQuery(newUser))

        const expectedResult = getSuccessResponse(OPERATION_TYPES.GET, newUser)

        const response = await chai.request(app).get(getUserByIdRoute(newUser.id))
        response.body.should.deep.equal(expectedResult)

        await remove(deleteUserByIdQuery(newUser.id))

        const deletedItem = await oneOrNone(getUserByIdQuery(newUser.id))
        should.equal(deletedItem, null)
    })
})
