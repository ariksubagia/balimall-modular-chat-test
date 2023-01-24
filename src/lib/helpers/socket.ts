import { io } from 'socket.io-client'
import { tokens } from '$lib/stores/authentication'
import { get } from 'svelte/store'
import refreshToken from '$lib/helpers/refreshToken'

let sio : any

export default function(){  
    return new Promise(function( resolve, reject ){
        if( sio ) return resolve(sio)

        sio = io(import.meta.env.VITE_API_ENDPOINT, { 
            transports : [ 'websocket' ],
            path : '/chat',
            auth : (callback) => {
                const t = get(tokens)
    
                callback({
                    token : t.access_token,
                    // token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc0MTUwMzcxLCJpYXQiOjE2NzQxNTAyNDcsImp0aSI6ImRlNjJhYjc0NDAxOTRkOTViMTMyNDgxODQ2M2I1YjM2IiwidXNlcl9pZCI6ODV9.jpMPh8wPk2r4h2y3TlOhIAi6iheWTsAL4LpkPtZcOVA',
                    userType : t.account_type
                })
            }
        })

        sio.on('connect', () => {
            console.log('[socket] connected to server')
            setTimeout(() => {
                resolve(sio)
            }, 100)
        })
    
        sio.on('disconnect', ( reason : any ) => {
            console.log(reason)
            reject(reason)
        })
    
        sio.on('connect_error', async ( err : any ) => {
            if( err.data.code == 'TOKEN_REJECTED' ){
                await refreshToken()
                sio.connect()
                return
            }
    
            reject(err)
        })
    })
}

export const disconnect = () => {
    if( sio ){
        sio.disconnect()
        sio = undefined
    }
}