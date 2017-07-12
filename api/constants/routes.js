const BASES = {
    USERS: '/users',
    PRODUCTS: '/products'
}

const IDS = {
    PRODUCT_ID: '/:productId',
    USER_ID: '/:userId'
}

export const ROUTES = {
    USERS : {
        BASE: BASES.USERS,
        EMPTY: '',
        ID: IDS.USER_ID,
        ADD_PRODUCT: IDS.USER_ID + BASES.PRODUCTS,
        ADD_PRODUCT_ID: IDS.USER_ID + BASES.PRODUCTS + IDS.PRODUCT_ID
    },
    PRODUCTS : {
        BASE: BASES.PRODUCTS,
        EMPTY: '',
        ID: IDS.PRODUCT_ID,
        ADD_USER: IDS.PRODUCT_ID + BASES.USERS,
        ADD_USER_ID: IDS.PRODUCT_ID + BASES.USERS + IDS.USER_ID
    }
}
