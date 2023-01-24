import { writable, derived, readable, get } from 'svelte/store'
import { verify } from '$lib/services/auth'

const fields = {
    ACCESS_TOKEN : 'cht_at',
    REFRESH_TOKEN : 'cht_rt',
    ACCOUNT_TYPE : 'cht_act'
}

export const refreshing = writable(undefined)

export const credential = writable(undefined as any)

export const tokens = writable({
    access_token : '',
    refresh_token : '',
    account_type : ''
}, ( set ) => {
    //ketika pertama kali subscribe, ambil token dari local storage
    const initialValue = {
        access_token : localStorage.getItem(fields.ACCESS_TOKEN) ?? '',
        refresh_token : localStorage.getItem(fields.REFRESH_TOKEN) ?? '',
        account_type : localStorage.getItem(fields.ACCOUNT_TYPE) ?? ''
    }

    set(initialValue)

    //buat watcher, dan update localstorage tiap kali ada perubahan token
    const tokensDerived = derived([ tokens ], async function([ $tokens ]){
        localStorage.setItem(fields.ACCESS_TOKEN, $tokens.access_token ? $tokens.access_token : '')
        localStorage.setItem(fields.REFRESH_TOKEN, $tokens.refresh_token ? $tokens.refresh_token : '')
        localStorage.setItem(fields.ACCOUNT_TYPE, $tokens.account_type ? $tokens.account_type : '')
    })
    
    //subscribe
    const subs = tokensDerived.subscribe(() => {
        console.log('watching tokens change')
    })

    return () => {
        subs()
    }
})