import { organizationSchema } from '@saas/auth'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { UnanuthorizedError } from '@/http/_erros/unanuthorized-error'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/http/utils/get-user-permissions'
import { prisma } from '@/lib/prisma'

export async function updateOrganization(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/organizations/:slug',
      {
        schema: {
          tags: ['organizations'],
          summary: 'Update an organization details',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
            domain: z.string().nullable(),
            shouldAttachUsersByDomain: z.boolean().optional(),
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()

        const { membership, organization } =
          await request.getUserMembership(slug)

        const { name, domain, shouldAttachUsersByDomain } = request.body

        const authOrganization = organizationSchema.parse(organization)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
          throw new UnanuthorizedError(
            "You're not allowed to update this organization.",
          )
        }

        if (domain) {
          const organizationByDomain = await prisma.organization.findFirst({
            where: {
              domain,
              slug: { not: slug },
            },
          })

          if (organizationByDomain) {
            throw new UnanuthorizedError(
              'Another organization with same domain already exists.',
            )
          }

          await prisma.organization.update({
            where: {
              id: organization.id,
            },
            data: {
              name,
              domain,
              shouldAttachUsersByDomain,
            },
          })
        }

        return reply.status(204).send()
      },
    )
}
