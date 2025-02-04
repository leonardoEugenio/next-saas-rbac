import { api } from './api-client'

interface SignInWithPasswordDataRequest {
  email: string
  password: string
}

interface SignInWithPasswordDataResponse {
  token: string
}

export async function signInWithPassword({
  email,
  password,
}: SignInWithPasswordDataRequest) {
  const result = await api
    .post('sessions/password', {
      json: {
        email,
        password,
      },
    })
    .json<SignInWithPasswordDataResponse>()

  return result
}
