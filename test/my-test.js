import chai from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../index'
import {
    getAllUsersRoute,
    getUserByIdRoute,
    getUsersProductsRoute,
    generateIdInvalid,
    generateIdsUnique,
    getAllProductsRoute
} from './helpers'
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
    getAllUsersQuery,
    getUsersRelationsQuery,
    getUsersIdsQuery,
    getAllUsersIdsQuery,
    getAllProductsIdsQuery,
    addUsersProductsQuery,
    deleteUsersProductsQuery,
    getAllProductsQuery,
    deleteUsersByIdsQuery,
    addUsersQuery,
    addProductsQuery,
    deleteProductsByIdsQuery
} from '../sql-queries'
import { getSuccessResponse, getFailureResponse } from '../helpers/response'
import { OPERATION_TYPES, ERRORS_DESCRIPTIONS } from '../api/constants'
import { USERS, CATALOG, PRODUCTS } from '../constants'
import { ROUTES } from '../api/constants/routes'
import { isValidUUID } from '../helpers/catalog'
import _ from 'lodash'

const should = chai.should()

chai.use(chaiHttp)

describe('GET /users', () => {
    it('returns success response', async () => {
        const initialSelect = await manyOrNone(getAllUsersQuery())
        const initialGet = await chai.request(app).get(getAllUsersRoute())
        initialGet.body.should.have.property('data').that.is.an('array')
        initialGet.body.data.should.deep.equal(initialSelect)

        const idsExisting = (await manyOrNone(getAllUsersIdsQuery())).map((item) => item.id)
        const idsNotExisting = generateIdsUnique(3, idsExisting)

        const newUsers = [{
            "name": "test_name_1",
            "login": "test_login_1",
            "id": idsNotExisting[0]
        }, {
            "name": "test_name_2",
            "login": "test_login_2",
            "id": idsNotExisting[1]
        }, {
            "name": "test_name_3",
            "login": "test_login_3",
            "id": idsNotExisting[2]
        }]

        let usersAdded = []
        try {
            usersAdded = await insert(addUsersQuery(newUsers))
            usersAdded.length.should.equal(newUsers.length)
            const response = await chai.request(app).get(getAllUsersRoute())
            response.body.should.have.property('data').that.is.an('array')
            response.body.data.should.deep.have.all.members(initialSelect.concat(newUsers))
        } catch(err) {
            console.log(`Insertion failed: ${err.name}(${err.message})`)
            await remove(deleteUsersByIdsQuery(idsNotExisting))
        }

        await remove(deleteUsersByIdsQuery(idsNotExisting))

        const finalSelect = await manyOrNone(getAllUsersQuery())
        const finalGet = await chai.request(app).get(getAllUsersRoute())
        finalGet.body.should.have.property('data').that.is.an('array')
        finalGet.body.data.should.deep.have.all.members(finalSelect)
    })
})

describe(`GET ${ROUTES.USERS.BASE + ROUTES.USERS.ID}`, () => {

    it('returns failure response, id has wrong type', (done) => {
        const idInvalid = generateIdInvalid()

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

    it('returns failure response, id does not exist', async () => {
        const idsExisting = await manyOrNone(getAllUsersIdsQuery())
        const idNotExisting = generateIdsUnique(1, idsExisting)

        const expectedResult = getFailureResponse(OPERATION_TYPES.GET, USERS.COLUMNS.ID, ERRORS_DESCRIPTIONS.NOT_EXISTS, {
            id: idNotExisting
        })

        try {
            const response = await chai.request(app).get(getUserByIdRoute(idNotExisting))
            response.body.should.deep.equal(expectedResult)
        } catch (err) {
            if (err.response) {
                err.response.body.should.deep.equal(expectedResult)
            } else {
                console.log(err.name, err.message)
            }
        }
    })

    it('returns success response, user ', async () => {
        const idsExisting = (await manyOrNone(getAllUsersIdsQuery())).map((item) => item.id)

        const newUser = {
            name: "test_name",
            login: "test_login",
            id: generateIdsUnique(1, idsExisting)
        }

        try {
            await insert(addUsersQuery([newUser]))
        } catch(err) {
            console.log(`Insertion failed: ${err.name}(${err.message})`)
            await remove(deleteUserByIdQuery(newUser.id))
        }

        const expectedResult = getSuccessResponse(OPERATION_TYPES.GET, newUser)

        try {
            const response = await chai.request(app).get(getUserByIdRoute(newUser.id))
            response.body.should.deep.equal(expectedResult)
        } catch(err) {
            if (err.response) {
                console.log(`Getting failed: ${err.response.body}`)
            } else {
                console.log(`Getting failed: ${err.name}(${err.message})`)
            }
            await remove(deleteUserByIdQuery(newUser.id))
        }

        try {
            await remove(deleteUserByIdQuery(newUser.id))
        } catch (err) {
            console.log(`Deletion failed: ${err.name}(${err.message})`)
        }

        const deletedItem = await oneOrNone(getUserByIdQuery(newUser.id))
        should.equal(deletedItem, null)
    })
})

describe(`GET ${ROUTES.USERS.BASE + ROUTES.USERS.GET_ALL_USERS_RELATIONS}`, () => {
    it('returns failure response, id has wrong type', async () => {
        const idInvalid = generateIdInvalid()

        const expectedResult = getFailureResponse(OPERATION_TYPES.GET, CATALOG.COLUMNS.USER_ID,
            ERRORS_DESCRIPTIONS.WRONG_TYPE, {
                [CATALOG.COLUMNS.USER_ID]: idInvalid
            })

        try{
            const response = await chai.request(app).get(getUsersProductsRoute(idInvalid))
            response.body.should.deep.equal(expectedResult)
        } catch(err) {
            if (err.response) {
                err.response.body.should.deep.equal(expectedResult)
            } else {
                console.dir(err.name, err.message)
            }
        }
    })

    it('returns failure response, id does not exist', async () => {
        const idsExisting = (await manyOrNone(getAllUsersIdsQuery())).map((item) => item.id)
        const idNotExisting = generateIdsUnique(1, idsExisting)

        const expectedResult = getFailureResponse(OPERATION_TYPES.GET, CATALOG.COLUMNS.USER_ID,
            ERRORS_DESCRIPTIONS.NOT_EXISTS, {
                [CATALOG.COLUMNS.USER_ID]: idNotExisting
            })

        try {
            const response = await chai.request(app).get(getUsersProductsRoute(idNotExisting))
            response.body.should.deep.equal(expectedResult)
        } catch (err) {
            if (err.response) {
                err.response.body.should.deep.equal(expectedResult)
            } else {
                console.log(err.name, err.message)
            }
        }
    })

    it('returns success response', async () => {
        const idsExistingUsers = (await manyOrNone(getAllUsersIdsQuery())).map((item) => item.id)
        const newUser = {
            "name": "test_name",
            "login": "test_login",
            "id": generateIdsUnique(1, idsExistingUsers)
        }

        const idsExistingProducts = (await manyOrNone(getAllProductsIdsQuery())).map((item) => item.id)
        const idsUniqueProducts = generateIdsUnique(3, idsExistingProducts)

        const newProducts = [{
            "name": "test_product_1",
            "price": 1,
            "id": idsUniqueProducts[0]
        }, {
            "name": "test_product_2",
            "price": 1,
            "id": idsUniqueProducts[1]

        }, {
            "name": "test_product_3",
            "price": 1,
            "id": idsUniqueProducts[2]
        }]

        let userAdded
        try {
            userAdded = await oneOrNone(addUsersQuery([newUser]))
            userAdded.should.not.equal(undefined)
        } catch(err) {
            console.log(`Insertion failed(user): ${err.name}(${err.message})`)
            should.not.equal(userAdded, undefined)
        }

        let productsAdded = []
        try {
            productsAdded = await insert(addProductsQuery(newProducts))
            productsAdded.length.should.equal(3)
        } catch(err) {
            console.log(`Insertion failed(products): ${err.name}(${err.message})`)
            await remove(deleteUserByIdQuery(newUser.id))
            await remove(deleteUsersByIdsQuery(idsUniqueProducts))
            productsAdded.length.should.equal(3)
        }

        let relationsAdded = []
        try {
            relationsAdded = await manyOrNone(addUsersProductsQuery(newUser.id, idsUniqueProducts))
            relationsAdded.length.should.equal(3)
        } catch(err) {
            console.log(`Insertion failed(relations): ${err.name}(${err.message})`)
            await remove(deleteUsersProductsQuery(newUser.id))
            await remove(deleteUserByIdQuery(newUser.id))
            await remove(deleteProductsByIdsQuery(idsUniqueProducts))
            relationsAdded.length.should.equal(3)
        }

        const expectedResult = getSuccessResponse(OPERATION_TYPES.GET, await manyOrNone(getUsersRelationsQuery(newUser.id)))

        let response
        try {
            response = await chai.request(app).get(getUsersProductsRoute(newUser.id))
            response.body.should.deep.equal(expectedResult)
            await remove(deleteUsersProductsQuery(newUser.id))
            await remove(deleteUserByIdQuery(newUser.id))
            await remove(deleteProductsByIdsQuery(idsUniqueProducts))
        } catch (err) {
            console.log(`Getting relations failed: ${err.name}(${err.message})`)
            await remove(deleteUsersProductsQuery(newUser.id))
            await remove(deleteUserByIdQuery(newUser.id))
            await remove(deleteProductsByIdsQuery(idsUniqueProducts))
            should.equal(response.body.data.length, 3)
        }

        const usersFromPostgres = await manyOrNone(getAllUsersQuery())
        const productsFromPostgres = await manyOrNone(getAllProductsQuery())

        try {
            const response = await chai.request(app).get(getAllUsersRoute())
            response.body.should.have.property('data').that.is.an('array')
            response.body.data.should.deep.have.all.members(usersFromPostgres)
        } catch(err) {
            console.log(`${err.name}: ${err.message}`)
            chai.assert.fail()
        }

        try {
            const response = await chai.request(app).get(getAllProductsRoute())
            response.body.should.have.property('data').that.is.an('array')
            response.body.data.should.deep.have.all.members(productsFromPostgres)
        } catch(err) {
            console.log(`${err.name}: ${err.message}`)
            chai.assert.fail()
        }
    })
})

describe('Helpers tests', () => {
    describe('getSuccessResponse tests', () => {
        it('returns correctly formatted success response', () => {
            const expectedResult = {
                "success": true,
                "operation": "get",
                "data": []
            }

            const actualResult = getSuccessResponse(OPERATION_TYPES.GET, [])

            actualResult.should.deep.equal(expectedResult)
        })
    })

    describe('getFailureResponse tests', () => {
        it('returns correctly formatted failure response', () => {
            const expectedResult = {
                "success": false,
                "message": "Cannot get element.",
                "error": "login already exists.",
                "data": {
                    "login": "test_login"
                }
            }

            const actualResult = getFailureResponse(OPERATION_TYPES.GET, USERS.COLUMNS.LOGIN, ERRORS_DESCRIPTIONS.EXISTS, {
                [USERS.COLUMNS.LOGIN]: "test_login"
            })

            actualResult.should.deep.equal(expectedResult)
        })
    })

    describe('idGenerators tests', () => {
        describe('generateIdInvalid', () => {
            it('returns id that does not match uuid pattern', () => {
                const isValidGeneratedId = isValidUUID(generateIdInvalid())

                isValidGeneratedId.should.equal(false)
            })
        })

        describe('generateIdsUnique', () => {
            it('returns 5 unique users ids as an array 100 times', async () => {
                _.times(100, async () => {
                    const idsExisting = (await manyOrNone(getAllUsersIdsQuery())).map((item) => item.id)
                    const idsGenerated = generateIdsUnique(5, idsExisting)
                    idsGenerated.length.should.equal(5)

                    const idsNotUnique = await manyOrNone(getUsersIdsQuery(idsGenerated))
                    idsNotUnique.should.be.empty
                })
            })

            it('returns 1 unique id as a string 100 times', async () => {
                _.times(100, async () => {
                    const idsExisting = (await manyOrNone(getAllUsersIdsQuery())).map((item) => item.id)
                    const idGenerated = generateIdsUnique(1, idsExisting)
                    idGenerated.should.be.a('string')

                    const idNotUnique = await oneOrNone(getUsersIdsQuery([idGenerated]))
                    should.equal(idNotUnique, null)
                })
            })
        })
    })
})
