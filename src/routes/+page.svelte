<script lang="ts">
    import ChatBox from './ChatBox.svelte'
    import ChatRoomList from './ChatRoomList.svelte'
    import UserCard from './UserCard.svelte'

    import socket, { disconnect } from '$lib/helpers/socket'
    import startChat from '$lib/helpers/startChat'
    import clearChat from '$lib/helpers/clearChat'

    import { credential } from '$lib/stores/authentication'
    import { activeRoom, rooms } from '$lib/stores/chat'
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    let currentActiveRoom : any

    onMount(async () => {
        console.log('+page mounted')

        const subActiveRoom = activeRoom.subscribe(( data : any ) => {

            // console.log(data)

            if( data ){
                if( currentActiveRoom?.id !== data?.id ){
                    currentActiveRoom = data
                }
                return
            }

            currentActiveRoom = undefined
        })

        const subListenToChatUpdate = await listenToChatUpdate()

        return () => {
            disconnect()
            clearChat()
            subActiveRoom()
            subListenToChatUpdate()
        }
    })

    async function createChat(){
        let merchantId : any = prompt('INPUT ID MERCHANT')
        if((merchantId ?? '').length <= 0) return

        merchantId = parseInt(merchantId)
        await startChat(merchantId)
    }

    async function listenToChatUpdate(){
        const sio : any = await socket()

        sio.on('chat-update', listener)

        function listener( data : any ){
            if( data.code.toUpperCase() === 'CHAT_NEW' ){
                addMessageToStore(data.detail)
            }
        }

        return function(){
            sio.off('chat-update', listener)
        }
    }

    function addMessageToStore( message : any ){
        rooms.update(( roomList : any ) => {
            let currentRoomIndex = roomList.findIndex(( currentRoom : any ) => currentRoom.id === message.room)
            roomList[currentRoomIndex].messages = [ ...(roomList[currentRoomIndex]?.messages ?? []), message ]
            
            const currentActiveRoom = get(activeRoom)
            if( currentActiveRoom?.id === roomList[currentRoomIndex].id ){
                activeRoom.update(x => roomList[currentRoomIndex])
            }

            return [ ...roomList ]
        })
    }
</script>

<div class="flex flex-row justify-center h-full bg-gradient-to-b from-slate-700 to-slate-800">
    <div class="flex flex-col container h-full">

        <div class="flex flex-row items-center justify-between gap-5 mb-10">
            <div class="flex flex-row items-center justify-start gap-5">
                <img src="http://103.152.36.22:8008/admin/assets/balimall-logo.eac61de7.png" alt="logo" class="w-32" />
                <h1 class="text-center text-4xl uppercase text-gray-300">CHAT TEST</h1>
            </div>  
            <div class="flex flex-row gap-3">
                {#if ($credential?.type ?? '').toUpperCase() == 'CUSTOMER'}
                <button on:click={createChat} class="text-gray-300 hover:bg-blue-800 transition-colors px-3 rounded">New Chat</button>
                {/if}
                <UserCard />
            </div>     
        </div>

        <div class="flex flex-row gap-3 flex-1 overflow-auto">
            <ChatRoomList />
            <div class="flex-1 flex flex-row h-full">
                {#if currentActiveRoom}
                <ChatBox />
                {:else}
                <div class="flex-1 flex flex-row items-center justify-center">
                    <div class="text-xl text-slate-500">Pilih chat untuk memulai</div>
                </div>
                {/if}
            </div>
        </div>

    </div>
</div>