import { getUserFromToken } from '$utils/apiFunctions';
export async function handle({ event, resolve }) {
    try {
        const session = event.cookies.get("session")
        if (!session) {
            return await resolve(event)
        }
        event.locals.user = await getUserFromToken(session)
    } catch (error) {
        event.locals.user = undefined
    }
    return await resolve(event)
}
