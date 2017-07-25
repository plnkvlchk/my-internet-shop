import { ROUTES } from '../../api/constants'

export function getAllUsersRoute() {
    return `${ROUTES.USERS.BASE}/`
}

export function getUserByIdRoute(id) {
    return `${ROUTES.USERS.BASE}/${id}`
}


