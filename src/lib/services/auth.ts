import axios from 'axios'
import api from '$lib/helpers/api'
import { tokens, credential } from '$lib/stores/authentication'
import { get } from 'svelte/store'

export type LoginInput = {
    type : string,
    username : string,
    password : string
}

export type Login = {
    ( input : LoginInput ) : Promise<any[]>
}

export type RefreshInput = {
    account_type : string,
    access_token : string,
    refresh_token : string
}

export type Refresh = {
    ( input? : RefreshInput ) : Promise<any[]>
}

export const login = async function(input){
    const rootApiEndpoint = import.meta.env.VITE_API_ENDPOINT

    let apiEndpoint = `${rootApiEndpoint}/api/customer/auth/login/`
    apiEndpoint = input.type.toUpperCase() == 'MERCHANT' ? `${rootApiEndpoint}/api/merchant/auth/login/` : apiEndpoint

    try{
        const response = await axios.post(apiEndpoint, {
            username : input.username,
            password : input.password
        })

        // tokens.update(store => ({
        //     ...store,
        //     access_token : response.data?.detail?.access_token,
        //     refresh_token : response.data?.detail?.refresh_token,
        //     account_type : input.type
        // }))

        const dataReturn = {
            ...(response.data?.detail ?? {}),
            account_type : input.type
        }

        return [ dataReturn , undefined ]
    }catch( e ){
        return [ undefined , e ]
    }
} satisfies Login

export const refresh = async function( input? ){
    const rootApiEndpoint = import.meta.env.VITE_API_ENDPOINT

    const { refresh_token, access_token, account_type } = input ?? get(tokens)

    let apiEndpoint = `${rootApiEndpoint}/api/customer/auth/refresh/`
    apiEndpoint = account_type.toUpperCase() == 'MERCHANT' ? `${rootApiEndpoint}/api/merchant/auth/refresh/` : apiEndpoint

    try{
        const response = await axios.post(apiEndpoint, {
            access_token,
            refresh_token
        })

        return [ response.data.detail, undefined ]
    }catch( e ){
        return [ undefined, e ]
    }
} satisfies Refresh

export const verify = async function( input : any ){
    let apiEndpoint = `/api/customer/my/profile/`
    apiEndpoint = input.account_type.toUpperCase() == 'MERCHANT' ? `/api/merchant/my/profile/` : apiEndpoint

    try{
        const result = await api.get(apiEndpoint)
        return [ result.data.detail, undefined ]
    }catch( e ){
        return [ undefined, e ]
    }
}

export const logout = function(){
    tokens.update(state => {
        return {
            access_token : '',
            refresh_token : '',
            account_type : ''
        }
    })

    credential.update(x => undefined)
}