import { error, json } from '@sveltejs/kit'
import { registerUser } from '$utils/apiFunctions';
// import jwt from 'jsonwebtoken';

export async function POST({ request }) {
    try {
        const { email, password, firstName, lastName } = await request.json();

        const newUser = await registerUser(email, password, firstName, lastName);
        if (newUser)
            return json({ email, firstName, lastName })
    } catch (e) {
        throw error(500, e)
    }
}