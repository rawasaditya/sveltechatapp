import { json } from '@sveltejs/kit'
import { searchAllFriends } from "$lib/utils/apiFunctions";

export async function GET({ request, locals }) {
    const friends = await searchAllFriends(locals)
    return json(friends)
} 