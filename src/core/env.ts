export const isProd = process.env.NODE_ENV === 'production'

export const backendURL = process.env.NEXT_PUBLIC_BACKEND || '/api'
