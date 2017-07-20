import express from 'express'
import * as get from './get'
import * as post from './post'
import * as del from './delete'
import * as put from './put'
import { ROUTES } from '../constants'

const router = new express.Router()

router.get(ROUTES.USERS.ID, get.getUserById)
router.get(ROUTES.USERS.EMPTY, get.getAll)
router.get(ROUTES.USERS.GET_ALL_USERS_RELATIONS, get.getUsersProducts)

router.post(ROUTES.USERS.EMPTY, post.addUser)
router.post(ROUTES.USERS.ADD_USERS_RELATIONS, post.addUsersProducts)

router.delete(ROUTES.USERS.ID, del.deleteUserById)
router.delete(ROUTES.USERS.EMPTY, del.deleteAllUsers)
router.delete(ROUTES.USERS.DELETE_USERS_RELATION_BY_IDS, del.deleteRelationByIds)
router.delete(ROUTES.USERS.DELETE_ALL_USERS_RELATIONS, del.deleteUsersRelations)

router.put(ROUTES.USERS.ID, put.updateUserById)

export default router
