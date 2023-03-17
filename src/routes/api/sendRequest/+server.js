import { error, json } from '@sveltejs/kit';
import { sendRequest } from "$lib/utils/apiFunctions"
export async function POST({ request, locals }) {
    try {
        const { id } = await request.json()
        const userAdded = sendRequest(id, locals)
        return json(userAdded)
    } catch (err) {
        throw error(500, err)
    }
}