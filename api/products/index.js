import express from 'express'
import * as get from './get'
import * as post from './post'
import * as del from './delete'
import * as put from './put'
import { ROUTES } from '../constants'

const router = new express.Router()

router.get(ROUTES.PRODUCTS.ID, get.getProductById)
router.get(ROUTES.PRODUCTS.EMPTY, get.getAll)
router.get(ROUTES.PRODUCTS.GET_ALL_PRODUCTS_RELATIONS, get.getProductsRelations)

router.post(ROUTES.PRODUCTS.EMPTY, post.addProduct)
router.post(ROUTES.PRODUCTS.ADD_PRODUCTS_RELATIONS, post.addProductsUsers)

router.delete(ROUTES.PRODUCTS.ID, del.deleteProductById)
router.delete(ROUTES.PRODUCTS.EMPTY, del.deleteAllProducts)
router.delete(ROUTES.PRODUCTS.DELETE_PRODUCTS_RELATION_BY_IDS, del.deleteRelationByIds)
router.delete(ROUTES.PRODUCTS.DELETE_ALL_PRODUCTS_RELATIONS, del.deleteProductsRelations)

router.put(ROUTES.PRODUCTS.ID, put.updateProductById)

export default router
