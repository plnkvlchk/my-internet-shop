import express from 'express'
import * as get from './get'
import * as post from './post'
import * as del from './delete'
import * as put from './put'
import { ROUTES } from '../constants'

const router = new express.Router()


router.get(ROUTES.USERS.ID, get.getUserById)
router.get(ROUTES.USERS.EMPTY, get.getAll)
router.get(ROUTES.USERS.ADD_PRODUCT, get.getUsersProducts)

router.post(ROUTES.USERS.EMPTY, post.addUser)
router.post(ROUTES.USERS.ADD_PRODUCT, post.addUsersProducts)

router.delete(ROUTES.USERS.ID, del.deleteUserById)
router.delete(ROUTES.USERS.EMPTY, del.deleteAllUsers)
router.delete(ROUTES.USERS.ADD_PRODUCT_ID, del.deleteRelationByIds)
router.delete(ROUTES.USERS.ADD_PRODUCT, del.deleteUsersRelations)

router.put(ROUTES.USERS.ID, put.updateUserById)

export default router
