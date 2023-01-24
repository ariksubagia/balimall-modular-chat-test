import axios from 'axios'
import { refresh, logout } from '$lib/services/auth'
import { refreshing, tokens } from '$lib/stores/authentication' 
import { fallback } from '$lib/helpers/guard'
import { get } from 'svelte/store'

const api = axios.create({
    baseURL : import.meta.env.VITE_API_ENDPOINT
})

api.interceptors.response.use(( response ) => {
    return response
}, async ( error ) => {
    if( error.response.status != 401 ){
        return Promise.reject(error)
    }

    let originalConfigs = error.config as any

    let refreshProcess : any
    let refreshProcessSub = refreshing.subscribe(data => {
        refreshProcess = data
    })

    if( !(refreshProcess instanceof Promise) ){
        refreshing.update((state) : any => {
            return new Promise(function( resolve, reject ){
                refresh().then(result => {
                    const [ newTokens, error ] = result

                    tokens.update(state => ({ ...state, ...newTokens }))
                    resolve(result)
                })
            })
        })
    }

    const [ newTokens, errorRefresh ] = await refreshProcess
    refreshProcessSub()
    if( errorRefresh ){
        console.log('test') 
        logout()
        fallback()
        return Promise.reject(errorRefresh) 
    }

    originalConfigs.headers['Authorization'] = `Bearer ${newTokens.access_token}`
    return api(originalConfigs)
})

api.interceptors.request.use(config => {
    let { access_token } = get(tokens)
    if( access_token.length <= 0 ) return config
    config.headers!['Authorization'] = `Bearer ${access_token}`
    return config
})

export default api