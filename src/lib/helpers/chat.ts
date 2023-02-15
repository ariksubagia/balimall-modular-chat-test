import normalizeChatRoom from '$lib/helpers/normalizeChatRoom'
import socket from '$lib/helpers/socket'
import { rooms } from '$lib/stores/chat'

export const chatInit = async () => {   
    return new Promise(function(resolve : any, reject){
        socket().then(( sio : any ) => {
            sio.emit('chat-init', ( response : any ) => {
                console.log('hit')
                if( (response.detail ?? []).length <= 0 ) return rooms.update(x => [])
        
                console.log('chat-init callback >>> ', response)

                rooms.update(x => response.detail.map((room : any) => {
                    return normalizeChatRoom(room)
                }))

                resolve()
            })
        })
    })
}