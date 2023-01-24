import { get } from 'svelte/store'
import { credential } from '$lib/stores/authentication'

export default function( room : any ){
    const myCredential = get(credential)
    const opponentType = myCredential.type.toUpperCase() == 'CUSTOMER' ? 'MERCHANT' : 'CUSTOMER'

    return {
        id : room.id,
        name : room.name,
        opponent : { ...room.participants.find((x : any) => x.participant_type == opponentType) },
        messages : []
    }
}