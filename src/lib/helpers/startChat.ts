import { rooms } from '$lib/stores/chat'
import socket from '$lib/helpers/socket'
import normalizeChatRoom from './normalizeChatRoom'

export default async function( merchantId : number ){
    const sio : any = await socket()

    function executor() : Promise<any>{
        return new Promise(function(resolve, reject){
            sio.emit('chat-create', {
                opponent : {
                    type : 'MERCHANT',
                    id : merchantId
                }
            }, function( response : any ){
                const chatRoom = normalizeChatRoom(response.detail)
    
                rooms.update(( x : any ) => {
                    if( x === null ) return [ chatRoom ]
                    return [ ...x, chatRoom ]
                })
    
                if( response.status ) resolve(chatRoom)
                else reject(response)
            })
        })      
    }

    const chatRoom = await executor()
    return chatRoom
}