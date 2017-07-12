import express from 'express'
import * as get from './get'
import * as post from './post'
import * as del from './delete'
import * as put from './put'
import { routes } from '../constants'

const router = new express.Router()

router.get(routes.PRODUCTS.ID, get.getProductById)
router.get(routes.PRODUCTS.EMPTY, get.getAll)
router.get(routes.PRODUCTS.ADD_USER, get.getProductsUsers)

router.post(routes.PRODUCTS.EMPTY, post.addProduct)
router.post(routes.PRODUCTS.ADD_USER, post.addProductsUsers)

router.delete(routes.PRODUCTS.ID, del.deleteProductById)
router.delete(routes.PRODUCTS.EMPTY, del.deleteAllProducts)
router.delete(routes.PRODUCTS.ADD_USER_ID, del.deleteRelationByIds)
router.delete(routes.PRODUCTS.ADD_USER, del.deleteProductsRelations)

router.put(routes.PRODUCTS.ID, put.updateProductById)

export default router
