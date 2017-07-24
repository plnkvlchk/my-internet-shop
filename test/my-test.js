import chai from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../index'
import { getAllUsersRoute, getUserByIdRoute } from './helpers'
import { insert, remove } from '../db'
import { addUserQuery, deleteUserByIdQuery  } from '../sql-queries'

const should = chai.should()

chai.use(chaiHttp)

// describe('GET /users', () => {
//     it('returns status 200, success response, data = *array of users*', (done) => {
//         chai.request(app)
//             .get(getAllUsersRoute())
//             .end((err, res) => {
//                 res.should.have.status(200)
//                 console.log(res.body)
//                 res.body.should.deep.equal({
//                     'success': true,
//                     'operation': 'get',
//                     'data': []
//                 })
//                 res.body.should.be.a('object')
//                 res.body.should.have.all.keys('success', 'operation', 'data')
//                 res.body.success.should.equal(true)
//                 res.body.data.should.be.a('array')
//
//                 done()
//             })
//     })
// })

describe('GET /users/:userId', () => {
    const newUser = {
        name: 'test_name',
        login: 'test_login_1',
        id: 'd88f09c3-49df-4a93-b15c-c685f3b557d5'
    }
    beforeEach(() => {
        insert(addUserQuery(newUser))
    })
    it(`returns status 200, success response, data = *object user with id = ${newUser.id}`, (done) => {
        chai.request(app)
            .get(getUserByIdRoute(newUser.id))
            .end((err, res) => {
                //console.log(res.body)
                res.body.should.deep.equal({
                    'success': true,
                    'operation': 'get',
                    'data': res.body.data.should.be.a('object').have.all.keys('id', 'login', 'name')
                })
                res.body.should.have.property('data')
                res.body.login.should.equal('test_login')
                res.body.data.should.have.all.keys('id', 'login', 'name')
                res.body.login.should.equal(newUser.login)
                done()
            })
    })
    afterEach(() => {
        remove(deleteUserByIdQuery(newUser.id))
    })
})
