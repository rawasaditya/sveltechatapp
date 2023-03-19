import { error, json } from '@sveltejs/kit';
import { getChatRoomReady } from "$lib/utils/apiFunctions";

export async function POST({ request, locals }) {
    try {
        const { id, from } = await request.json()
        const chatRoomDetails = await getChatRoomReady(id, from)
        return json(chatRoomDetails)
    } catch (err) {
        console.log(err)
        throw error(500, err)
    }
}