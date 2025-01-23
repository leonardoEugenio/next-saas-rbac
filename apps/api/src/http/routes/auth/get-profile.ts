import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z, { string } from 'zod'

import { BadRequestError } from '@/http/_erros/bad-request-error'
import { prisma } from '@/lib/prisma'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authemticated user profile',
        response: {
          200: z.object({
            user: z.object({
              id: string(),
              name: string().nullable(),
              email: string(),
              avatarUrl: string().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { sub } = await request.jwtVerify<{ sub: string }>()

      const user = await prisma.user.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
        where: {
          id: sub,
        },
      })

      if (!user) {
        throw new BadRequestError('User not found')
      }

      return reply.send({ user })
    },
  )
}
