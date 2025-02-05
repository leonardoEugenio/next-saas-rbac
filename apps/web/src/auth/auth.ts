import { cookies } from 'next/headers'

export async function isAuthenticated() {
  const cookiesStore = await cookies()
  return !!cookiesStore.get('token')?.value
}
