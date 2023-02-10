<script lang="ts">
    import { activeRoom, rooms } from '$lib/stores/chat'
    import { credential } from '$lib/stores/authentication'
    import socket from '$lib/helpers/socket'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    import ChatMessageList from './ChatMessageList.svelte'
    import { Input } from 'postcss';

    let opponent : any
    let myCredential : any
    let messages : any[] = []
    let room : any = undefined

    let someoneTyping : any = undefined
    let iWasTyping : Boolean = false

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

        const subListenToTyping = await listenToTyping()

        return () => {
            subActiveChat()
            subListenToTyping()
        }
    })

    async function listenToTyping(){
        const sio : any = await socket()
        const listener = ( response : any ) => {
            if( response.code in [ 'TYPE_START', 'TYPE_END' ] ){
                if( response.code === 'TYPE_END' && 
                    someoneTyping?.sender?.id === response.detail.sender.id){
                    someoneTyping = undefined
                    return
                }

                someoneTyping = response.detail
            }
        }

        sio.on('chat-send', listener)
        return () => {
            sio.off('chat-send', listener)
        }
    }

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

    async function onInputKeydown( this : HTMLInputElement ){
        if( this.value.length <= 0 || iWasTyping ) return

        iWasTyping = true
        const sio : any = await socket()
        sio.emit('chat-send', {
            type : 'TYPE_START',
            payload : {
                room
            }
        })
    }

    async function onInputBlur(){
        const sio : any = await socket()
        sio.emit('chat-send', {
            type : 'TYPE_END',
            payload : {
                room
            }
        })
        iWasTyping = false
    }

    async function onAttachClick(){
        const sio : any = await socket()

        const inputDOM = document.createElement('input')
        inputDOM.setAttribute('type', 'file')

        inputDOM.addEventListener('change', function( this : any ){
            if( this.files.length > 0 ){
                sio.emit('chat-attach', {
                    file : this.files[0],
                    filename : this.files[0].name,
                    room
                })
            }
        })

        inputDOM.click()
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
            <button type="button" on:click={onAttachClick} class="w-14 text-white shrink-0 hover:bg-slate-900 transition-colors">@</button>
            <input on:keydown={onInputKeydown} on:blur={onInputBlur} name="message" type="text" class="flex-1 bg-transparent p-3 text-gray-200 outline-none border-0" placeholder="Ketik pesan disini ..." />
            <button class="w-20 text-white shrink-0 hover:bg-slate-900 transition-colors" type="submit">SEND</button>
        </form>

        {#if someoneTyping}
        <div class="text-xs text-gray-400 px-3 py-2">sedang mengetik ...</div>
        {/if}
    </div>
</div>