import express from 'express'
import users from './users'
import products from './products'
import { routes } from './constants/'

const router = new express.Router()

router.use(routes.USERS.BASE, users)
router.use(routes.PRODUCTS.BASE, products)

export default router
