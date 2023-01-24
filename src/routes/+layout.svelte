<script lang="ts">
    import '../app.css'

    import { onMount } from 'svelte'

    onMount(function(){
        window.onunhandledrejection = function( e ){
            // e.preventDefault()
            // console.log(e.reason)
        }
    })
</script>

<slot></slot>