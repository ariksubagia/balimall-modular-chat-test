<script lang="ts">
import { credential } from '$lib/stores/authentication'
import { logout } from "$lib/services/auth"
import { fallback } from '$lib/helpers/guard'
import { onMount } from 'svelte'

let myCredential : any

let loggingOut : any

onMount(() => {
    const subCredential = credential.subscribe(dataCredential => myCredential = dataCredential)
    return subCredential
})

async function onLogoutClick(){
    loggingOut = logout()
    fallback()
}
</script>

{#await myCredential}
    <div class="flex flex-row gap-3 items-center">
        <div class="text-gray-300">loading ...</div>
        <!-- <div class="rounded-full h-12 w-12 bg-slate-800"></div> -->
    </div>
{:then data}
    <div class="flex flex-row gap-3">
        {#await loggingOut}
        <div class="px-3 py-1 text-slate-300">Logging out ...</div>
        {:then}
        <button on:click={onLogoutClick} class="bg-transparent px-3 py-1 text-slate-300 hover:bg-slate-800 transition-colors rounded">Logout</button>
        {/await}

        <div class="flex flex-row items-center gap-3 bg-slate-800 p-2 rounded select-none">
            <div class="text-gray-300">{data?.account?.name}</div>
            <div class="text-sm rounded px-3 py-1 text-slate-600" 
                class:bg-blue-400={ data?.type == 'MERCHANT' }
                class:bg-green-400={ data?.type == 'CUSTOMER' }>{(data?.type ?? '').toLowerCase()}</div>
        </div>
        <!-- <div class="rounded-full h-12 w-12 bg-slate-800"></div> -->
    </div>
{/await}