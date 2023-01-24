<script lang="ts">
    import login from '$lib/helpers/login'

    let busy = false

    async function handleSubmit(this: HTMLFormElement){
        const data = {
            type : this.type.value,
            username : this.username.value,
            password : this.password.value
        }

        try{
            busy = true
            await login(data)  
        }catch(e : any){
            alert(e.message)
            throw e
        }finally{
            busy = false
        }
    }
</script>

<div class="flex flex-row justify-center items-center h-full">
    <form on:submit|preventDefault={handleSubmit} method="POST" class="p-10 rounded overflow-hidden bg-gradient-to-b from-slate-700 to-slate-800 flex flex-col gap-3 shadow-2xl" style="width:600px;">
        <fieldset disabled={busy} class="flex flex-row items-center justify-between mb-10">
            <img src="http://103.152.36.22:8008/admin/assets/balimall-logo.eac61de7.png" alt="logo" class="w-32" />
            <h1 class="text-center text-4xl uppercase text-gray-300">CHAT TEST</h1>
        </fieldset>
        
        <fieldset disabled={busy} class="flex flex-col pb-5">
            <select name="type" class="px-3 py-2 bg-slate-600 text-gray-300 rounded h-10 outline-none border-0">
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="MERCHANT">MERCHANT</option>
            </select>
        </fieldset>
        <fieldset disabled={busy} class="flex flex-col">
            <input name="username" type="text" placeholder="Username" class="px-3 py-2 bg-slate-600 text-gray-300 rounded h-10 outline-none border-0" />
        </fieldset>
        <fieldset disabled={busy} class="flex flex-col">
            <input name="password" type="password" placeholder="Password" class="px-3 py-2 bg-slate-600 text-gray-300 rounded h-10 outline-none border-0" />
        </fieldset>
        
        <fieldset disabled={busy} class="flex flex-row justify-end pt-5">
            <button type="submit" class="bg-indigo-800 px-5 h-10 rounded text-gray-300 transition-colors hover:bg-indigo-600">masuk</button>
        </fieldset>
    </form>
</div>