'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'

const singInSchema = z.object({
  email: z.string().email({ message: 'Please, provide a valid e-mail' }),
  password: z.string().min(1, { message: 'Please, provide a password' }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = singInSchema.safeParse(Object.fromEntries(data))
  const cookiesStore = await cookies()

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    cookiesStore.set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Unexepected error, try again later',
      errors: null,
    }
  }

  redirect('/')
}
