import { error, json } from '@sveltejs/kit'
import { searchAllUsers } from '$lib/utils/apiFunctions'
export async function POST({ request, locals }) {
    try {
        const { search } = await request.json();
        let users = await searchAllUsers(search, locals.user.id)
        users = users.filter(i => i.id !== locals.user.id)
        return json(users)
    } catch (err) {
        throw error(500, err)

    }
}