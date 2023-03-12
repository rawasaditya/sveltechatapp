import { error, json } from '@sveltejs/kit'
import { validateUser, generateSignToken } from '$utils/apiFunctions';
export async function POST({ request, cookies }) {
    try {
        const { email, password } = await request.json();
        const isValid = await validateUser(email, password);
        if (isValid) {
            const token = await generateSignToken(email)
            cookies.set('session', token, {
                path: '/',
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 * 30
            });
        } else {
            throw "User Does not have valid credentials"
        }
        return json({ "success": "success" })

    } catch (e) {
        throw error(500, e)
    }
}