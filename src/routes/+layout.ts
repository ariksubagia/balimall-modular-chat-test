import type { LayoutLoad } from './$types'

import { browser } from '$app/environment'

import guard from '$lib/helpers/guard'

export const ssr = false

export const load = (async function( events ){
    if( browser ){
        await guard({
            exclude : [ '/login' ]
        }, events)

        return
    }
}) satisfies LayoutLoad