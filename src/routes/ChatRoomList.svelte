<script lang="ts">
    import ChatRoomCard from "./ChatRoomCard.svelte"
    import normalizeChatRoom from '$lib/helpers/normalizeChatRoom'
    import socket from '$lib/helpers/socket'
    import { chatInit } from '$lib/helpers/chat'
    import { activeRoom, rooms } from '$lib/stores/chat'

    import { onMount } from 'svelte'
    import { get } from 'svelte/store'

    onMount(async () => {
        console.log('chatroomlist mounted')
        const initSubcriber = await init()
        return () => {
            initSubcriber()
        }
    })

    async function init(){
        const sio : any = await socket()

        const listener = ( response : any ) => {
            if( (response.code ?? '').toUpperCase() !== 'CONVERSATIONS' ) return
            if( (response.detail ?? []).length <= 0 ) return rooms.update(x => [])

            console.log('chat-update listener >>> ', response)

            rooms.update(x => response.detail.map((room : any) => {
                return normalizeChatRoom(room)
            }))
        }

        sio.on('chat-update', listener)

        await chatInit()

        return () => {
            sio.off('chat-update', listener)
        }
    }

    function onChatRoomClick( chatRoom : any ){
        return () => {
            activeRoom.update((x : any) => {
                const dataRooms = get(rooms)
                console.log(dataRooms)
                return dataRooms.find((y : any) => y.id === chatRoom.id)
            })
        }
    }
</script>

<style>
    .chat-rooms{
        scrollbar-width: thin;
        scrollbar-color: blue;
    }
</style>

<div class="chat-rooms flex-grow-0 h-full overflow-auto" style="width:300px;">
    {#if $rooms === null}
    <div class="p-3 text-gray-300">Loading chat list ...</div>
    {:else}
        {#if $rooms.length <= 0}
        <div class="p-3 text-center text-gray-300 bg-slate-600 px-3 py-2 rounded">Tidak ada chat</div>
        {:else}
            {#each ($rooms ?? []) as room}
                <ChatRoomCard on:click={onChatRoomClick(room)} {room} />
            {/each}
        {/if}
    {/if}
</div>