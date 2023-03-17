import { error, json } from '@sveltejs/kit'
import { searchAllUsers } from '$lib/utils/apiFunctions'
export async function POST({ request, locals }) {
    try {
        const { search } = await request.json();
        let users = await searchAllUsers(search, locals)
        users = users.filter(i => i.id !== locals.user.id)
        return json(users)
    } catch (err) {
        throw error(500, err)

    }
}

// DATABASE_URL="mongodb+srv://hydra:cSK0iFTdfuS8LoFI@cluster0.vpkeb.mongodb.net/svelteChat?ssl=true&connectTimeoutMS=5000"