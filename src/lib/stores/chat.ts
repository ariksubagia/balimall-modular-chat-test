import { writable, derived } from 'svelte/store'

export const rooms = writable(null as any)
export const chat = writable(null as any)
export const activeRoom = writable(undefined as any)