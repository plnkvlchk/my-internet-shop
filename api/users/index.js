import express from 'express'
import * as get from './get'
import * as post from './post'
import * as del from './delete'
import * as put from './put'
import { routes } from '../constants'

const router = new express.Router()


router.get(routes.USERS.ID, get.getUserById)
router.get(routes.USERS.EMPTY, get.getAll)
router.get(routes.USERS.ADD_PRODUCT, get.getUsersProducts)

router.post(routes.USERS.EMPTY, post.addUser)
router.post(routes.USERS.ADD_PRODUCT, post.addUsersProducts)

router.delete(routes.USERS.ID, del.deleteUserById)
router.delete(routes.USERS.EMPTY, del.deleteAllUsers)
router.delete(routes.USERS.ADD_PRODUCT_ID, del.deleteRelationByIds)
router.delete(routes.USERS.ADD_PRODUCT, del.deleteUsersRelations)

router.put(routes.USERS.ID, put.updateUserById)

export default router
