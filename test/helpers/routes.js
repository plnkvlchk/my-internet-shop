import { ROUTES } from '../../api/constants'

export function getAllUsersRoute() {
    return `${ROUTES.USERS.BASE}/`
}

export function getUserByIdRoute(id) {
    return `${ROUTES.USERS.BASE}/${id}/`
}

export function getUsersProductsRoute(id) {
    return `${ROUTES.USERS.BASE}/${id}${ROUTES.PRODUCTS.BASE}/`
}

export function getAllProductsRoute() {
    return `${ROUTES.PRODUCTS.BASE}/`
}
