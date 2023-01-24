import { tokens } from '$lib/stores/authentication'
import { refresh } from '$lib/services/auth'
import { get } from 'svelte/store'

export default async () => {
    const dataTokens = get(tokens)

    const [ result, error ] = await refresh(dataTokens)
    if( error ) throw error

    tokens.update(x => ({
        ...x,
        ...result
    }))
}