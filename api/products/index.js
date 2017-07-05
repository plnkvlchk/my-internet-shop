import express from 'express'
import * as get from './get'
import * as post from './post'
import * as del from './delete'
import * as put from './put'

const router = new express.Router();

router.get('/:productId', get.getProductById);
router.get('', get.getAll);
router.get('/:productId/users/', get.getProductUsers)

router.post('/', post.addProduct)
router.post('/:productId/users/', post.addProductUsers)

router.delete('/:productId', del.deleteProductById)
router.delete('', del.deleteAllProducts)
router.delete('/:productId/users/:userId', del.deleteRelationByIds)
router.delete('/:productId/users/', del.deleteProductsRelations)

router.put('/:productId', put.updateProductById)


export default router



