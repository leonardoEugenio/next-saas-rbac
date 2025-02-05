import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

import { signInWithGitHub } from '@/http/sign-in-with-github'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cookiesStore = await cookies()

  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json(
      { message: 'Github Oauth code was not found' },
      { status: 400 },
    )
  }

  const { token } = await signInWithGitHub({ code })

  cookiesStore.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })

  const redirectUrl = request.nextUrl.clone()

  redirectUrl.pathname = '/'
  redirectUrl.searchParams.delete('code')

  return NextResponse.redirect(redirectUrl.pathname)
}
