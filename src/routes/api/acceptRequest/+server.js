import { error, json } from '@sveltejs/kit';
import { acceptRequest, generateNotification, deleteNotification } from "$lib/utils/apiFunctions";
export async function POST({ request, locals }) {
    try {
        const { id, accept, notificationId } = await request.json()
        const requestAccepted = await acceptRequest(id, locals, accept)
        if (requestAccepted) {
            await generateNotification(id, locals);
            if (notificationId) {
                await deleteNotification(notificationId);
            }
        }
        return json(requestAccepted)
    } catch (err) {
        console.log(err)
        throw error(500, err)
    }
}