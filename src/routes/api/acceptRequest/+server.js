import { error, json } from '@sveltejs/kit';
import { acceptRequest } from "$lib/utils/apiFunctions";
export async function POST({ request, locals }) {
    try {
        const { id, accept } = await request.json()
        const requestAccepted = acceptRequest(id, locals, accept)
        return json(requestAccepted)
    } catch (err) {
        throw error(500, err)
    }
}