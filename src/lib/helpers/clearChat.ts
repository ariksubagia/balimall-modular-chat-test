import { chat, rooms } from '$lib/stores/chat'

export default function(){
    chat.update(x => null)
    rooms.update(x => null)
}