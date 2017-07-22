import express from 'express'
import users from './users'
import products from './products'
import { ROUTES } from './constants/'

const router = new express.Router()

router.use(ROUTES.USERS.BASE, users)
router.use(ROUTES.PRODUCTS.BASE, products)

export default router
