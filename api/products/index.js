import express from 'express'
import * as get from './get'
import * as post from './post'
import * as del from './delete'
import * as put from './put'
import { ROUTES } from '../constants'

const router = new express.Router()

router.get(ROUTES.PRODUCTS.ID, get.getProductById)
router.get(ROUTES.PRODUCTS.EMPTY, get.getAll)
router.get(ROUTES.PRODUCTS.ADD_USER, get.getProductsRelations)

router.post(ROUTES.PRODUCTS.EMPTY, post.addProduct)
router.post(ROUTES.PRODUCTS.ADD_USER, post.addProductsUsers)

router.delete(ROUTES.PRODUCTS.ID, del.deleteProductById)
router.delete(ROUTES.PRODUCTS.EMPTY, del.deleteAllProducts)
router.delete(ROUTES.PRODUCTS.ADD_USER_ID, del.deleteRelationByIds)
router.delete(ROUTES.PRODUCTS.ADD_USER, del.deleteProductsRelations)

router.put(ROUTES.PRODUCTS.ID, put.updateProductById)

export default router
