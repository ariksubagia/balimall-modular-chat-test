<script lang="ts">
    import { credential } from '$lib/stores/authentication'
    export let messages : any = []

    function isOwnMessage( message : any , myCredential : any){
        if( !myCredential ) return false
        return message.sender.id === myCredential.account.id && message.sender.type.toUpperCase() === myCredential.type.toUpperCase()
    }

    function scrollToBottom(node : HTMLElement, config : any ){
        return {
            update( config : any ){
                node.scrollTop = node.scrollHeight
            }
        }
    }
</script>

<div class="chat-list flex flex-col gap-3 flex-1 flex-shrink-0 overflow-y-auto p-5" use:scrollToBottom={{ messages }}>
    {#each messages as message}
    <div class="chat-block px-5 flex flex-row" class:justify-end={ isOwnMessage(message, $credential) }>
        <div class="rounded-full bg-slate-500 text-slate-800 p-3" 
            class:rounded-tr-none={ isOwnMessage(message, $credential) }
            class:rounded-bl-none={ !isOwnMessage(message, $credential) }>
            {message.message}
        </div>
    </div>
    {/each}
</div>