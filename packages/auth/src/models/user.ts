import { z } from 'zod'
import { Role, rolesSchema } from '../roles'

export const userSchema = z.object({
  id: z.string(),
  role: rolesSchema,
})

export type User = z.infer<typeof userSchema>
