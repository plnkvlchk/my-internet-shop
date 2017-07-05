import express from 'express'
import * as get from './get'
import * as post from './post'
import * as del from './delete'
import * as put from './put'

const router = new express.Router();

router.get('/:userId', get.getUserById);
router.get('', get.getAll);
router.get('/:userId/products/', get.getUserProducts)

router.post('/', post.addUser)
router.post('/:userId/products/', post.addUserProducts)

router.delete('/:userId', del.deleteUserById)
router.delete('/', del.deleteAllUsers)
router.delete('/:userId/products/:productId', del.deleteRelationByIds)
router.delete('/:userId/products/', del.deleteUsersRelations)

router.put('/:userId', put.updateUserById)




export default router