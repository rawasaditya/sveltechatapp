import { error, json } from '@sveltejs/kit';
import { saveMessage } from '$lib/utils/apiFunctions';
export async function POST({ request }) {
    try {
        const body = await request.json()
        const chat = await saveMessage(body);
        return json(chat)
    } catch (err) {
        throw error(err)
    }
}