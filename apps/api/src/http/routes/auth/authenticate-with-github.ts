import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

export async function authenticateWithGitHub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/github',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with Github',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request) => {
      const { code } = request.body

      const githubOAuthURL = new URL(
        'https://github.com/login/oauth/access_token',
      )

      githubOAuthURL.searchParams.set('client_id', 'Ov23livSZKn3YoG6O4LB')
      githubOAuthURL.searchParams.set(
        'client_secret',
        'fc39961efc5ffd0e0b3c6fff41aafe64f245ae3e',
      )
      githubOAuthURL.searchParams.set(
        'redirect_uri',
        'http://localhost:3000/api/auth/callback',
      )
      githubOAuthURL.searchParams.set('code', code)

      const githubAccessTokenResponse = await fetch(githubOAuthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const githubAccessTokenData = await githubAccessTokenResponse.json()

      console.log(githubAccessTokenData)
    },
  )
}

// https://github.com/login/oauth/authorize?client_id=Ov23livSZKn3YoG6O4LB&redirect_uri=http://localhost:3000/api/auth/callback&scope=user:email
