import { error, json } from '@sveltejs/kit'
import { getNotifications } from "$lib/utils/apiFunctions"
export async function POST({ request }) {
    try {
        const { id } = await request.json();
        const notifications = await getNotifications(id);
        return json(notifications)
    } catch (err) {
        console.log(err)
        throw error(500, err)
    }
}