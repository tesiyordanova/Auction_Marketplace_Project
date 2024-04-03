
interface ImportMetaEnv {
    readonly VITE_LOGOUT_ENDPOINT: string
    readonly VITE_GOOGLE_LOGIN_ENDPOINT: string
    readonly VITE_LOGIN_ENDPOINT: string
    readonly VITE_REGISTER_ENDPOINT: string
    readonly VITE_BASE_URL: string
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly VITE_CREATE_CAUSE_ENDPOINT: string
    readonly VITE_GET_ALL_CAUSES_ENDPOINT: string
    readonly VITE_GET_CAUSE_BY_ID_ENDPOINT: string
    readonly VITE_GET_USER_ENDPOINT: string
    readonly VITE_UPDATE_USER_ENDPOINT: string
    readonly VITE_CHECK_STRIPE_USER: string
    readonly VITE_GET_AUCTIONS: string
    readonly VITE_CREATE_AUCTION_ENDPOINT: string
    readonly VITE_UPDATE_AUCTION_ENDPOINT: string
    readonly VITE_GET_AUCTION_BY_ID_ENDPOINT: string
    readonly VITE_DELETE_AUCTION_BY_ID_ENDPOINT: string
    readonly VITE_UPDATE_CAUSE_BY_ID_ENDPOINT: string
    readonly VITE_DELETE_CAUSE_BY_ID_ENDPOINT: string
    readonly VITE_PLACE_BID_ENDPOINT: string
    readonly VITE_CHECK_FINAL_BID_ENDPOINT: string
    readonly VITE_GET_PAYMENTS_BY_USER_ID_ENDPOINT: string
    readonly VITE_GET_AUCTIONS_BIDDED: string
    readonly VITE_GET_USER_BY_EMAIL_ENDPOINT: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}