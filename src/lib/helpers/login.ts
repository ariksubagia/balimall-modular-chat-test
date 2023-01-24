import type { LoginInput } from '$lib/services/auth'
import { login } from '$lib/services/auth'
import { tokens } from '$lib/stores/authentication'
import { goto } from '$app/navigation'

export default async function( input : LoginInput ){
    const [ result, error ] = await login(input)

    if( error ) throw error

    tokens.update(x => ({ ...result }))

    goto('/')
}