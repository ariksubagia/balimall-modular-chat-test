<script lang="ts">
    import { activeRoom, rooms } from '$lib/stores/chat'
    import { credential } from '$lib/stores/authentication'
    import socket from '$lib/helpers/socket'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    import ChatMessageList from './ChatMessageList.svelte'

    let opponent : any
    let myCredential : any
    let messages : any[] = []
    let room : any = undefined

    onMount(async () => {
        console.log('chatbox mounted')
        myCredential = get(credential)

        const subActiveChat = activeRoom.subscribe(async (dataActiveRoom : any) => {
            if( dataActiveRoom ){
                opponent = dataActiveRoom?.opponent
                room = dataActiveRoom.id
                messages = dataActiveRoom?.messages ?? []

                const sio : any = await socket()
                sio.emit('chat-room', room, (response : any) => {
                    messages = response.detail.messages
                    rooms.update(( roomList : any ) => {
                        let currentRoomIndex = roomList.findIndex(( currentRoom : any ) => currentRoom.id === room)
                        roomList[currentRoomIndex].messages = messages
                        return [ ...roomList ]
                    })
                })
            }
        })

        return () => {
            subActiveChat()
        }
    })

    async function onSendChat( this : any, e : any ){
        const sio : any = await socket()

        let context = {
            type : 'CHAT_NEW',
            payload : {
                message : this.message.value,
                // attachment : null,
                room
            }
        }

        sio.emit('chat-send', context, function( data : any ){
            rooms.update((x : any) => {
                const chatRoomIndex = x.findIndex((y : any) => y.id == room)
                if( chatRoomIndex < 0 ) return x

                x[chatRoomIndex] = {
                    ...x[chatRoomIndex],
                    messages : [ 
                        ...x[chatRoomIndex].messages, 
                        data.detail
                    ]
                }

                messages = [ ...x[chatRoomIndex].messages ]

                return [ ...x ]
            })
        })

        this.message.value = ''
    }


</script>

<style>
    .chat-box{
        min-height: 500px;
    }
</style>

<div class="chat-box rounded bg-slate-700 shadow-lg flex flex-col flex-1 overflow-auto flex-nowrap mb-10">
    <div class="flex flex-row gap-3 items-center p-3 border-b border-b-slate-800">
        <div class="chat-room-image bg-slate-800 rounded-full h-12 w-12"></div>
        <h3 class="text-gray-300">{opponent?.name}</h3>
    </div>
    <ChatMessageList {messages} />
    <div class="p-3">
        <form on:submit|preventDefault={onSendChat} class="chat-input flex flex-row bg-slate-800 rounded">
            <button class="w-14 text-white shrink-0 hover:bg-slate-900 transition-colors">@</button>
            <input name="message" type="text" class="flex-1 bg-transparent p-3 text-gray-200 outline-none border-0" placeholder="Ketik pesan disini ..." />
            <button class="w-20 text-white shrink-0 hover:bg-slate-900 transition-colors" type="submit">SEND</button>
        </form>
    </div>
</div>