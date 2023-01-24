<script lang="ts">
import { createEventDispatcher } from 'svelte'

export let room : any
</script>

<div on:click on:keydown on:keypress on:keyup class="chat-room flex flex-row gap-3 items-center px-3 py-2 hover:bg-slate-700 transition-colors rounded overflow-hidden select-none cursor-pointer">
    <div class="chat-room-image bg-slate-800 rounded-full h-12 w-12"></div>
    <div class="chat-room-summary flex-1">
        <div class="chat-room-name text-gray-200">{room.opponent.name}</div>
        <p class="text-xs text-gray-400">Sunt et labore et commodo fugiat.</p>
    </div>
    <div class="chat-room-timestamp text-gray-400 text-xs">21 Jan</div>
</div>