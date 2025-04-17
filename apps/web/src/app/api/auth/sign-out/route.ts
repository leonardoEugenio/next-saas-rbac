import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/auth/sign-in'

  const cookiesStore = await cookies()

  cookiesStore.delete('token')

  return NextResponse.redirect(redirectUrl)
}
