import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { verify } from '$lib/services/auth'

import { credential, tokens } from '$lib/stores/authentication'
import { get, writable } from 'svelte/store'

export type GuardOptions = {
    exclude? : string[],
    include? : string[],
    fallback? : string
}

export type Guard = {
    ( options : GuardOptions, pageData? : any ) : void
}

export const GuardMeta = writable(undefined as any)

const auth = async function() : Promise<boolean>{
    const { access_token, account_type } = get(tokens)

    if( account_type.length > 0 && access_token.length > 0 && typeof get(credential) === 'undefined' ){
        const [ result, error ] = await verify({ access_token, account_type })
        if( error ) throw error
        credential.update(x => ({ type : account_type, account : result[account_type.toLowerCase()] }))
    }

    let creds : any = get(credential)

    if( typeof creds === 'undefined' ){
        return false
    }

    if( creds instanceof Promise ){
        const [ result , error ] = await creds
        if( error ) throw error
        creds = result
    }

    if( Object.keys(creds.account).length > 0 && creds.type.length > 0 ) return true

    return false
}

const guard = async function( options : GuardOptions, pageData? : any ){
    const defaultFallback : string = '/login'

    const defaultOptions : GuardOptions = {
        exclude : [],
        include : []
    }

    const configs = { ...defaultOptions, ...options }

    const fallback : string = configs.fallback ?? defaultFallback

    GuardMeta.update(state => ({ ...configs, fallback }))

    let pageDataCandidate = pageData ? pageData : get(page)

    const authResult = await auth()

    if( (configs.include ?? []).length > 0 ){
        if( configs.include?.includes(pageDataCandidate.route.id ?? '') && !authResult ){
            goto(fallback)
        }
    }else if( (configs.exclude ?? []).length > 0 ){
        if( pageDataCandidate.route.id == fallback && authResult){
            goto('/')
            return
        }

        if( !configs.exclude?.includes(pageDataCandidate.route.id ?? '') && !authResult ){
            goto(fallback)
        }
    }
} satisfies Guard

export const fallback = function(){
    const guardMeta = get(GuardMeta)
    console.log('guardMeta >>> ', guardMeta)
    goto(guardMeta.fallback)
}

export default guard