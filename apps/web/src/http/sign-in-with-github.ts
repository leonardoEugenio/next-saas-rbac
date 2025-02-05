import { api } from './api-client'

interface SignInWithGitHubDataRequest {
  code: string
}

interface SignInWithGitHubDataResponse {
  token: string
}

export async function signInWithGitHub({ code }: SignInWithGitHubDataRequest) {
  const result = await api
    .post('sessions/github', {
      json: {
        code,
      },
    })
    .json<SignInWithGitHubDataResponse>()

  return result
}
