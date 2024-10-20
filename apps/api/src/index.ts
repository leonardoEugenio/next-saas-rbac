import { defineAbilitiesFor } from '@saas/auth'

const ability = defineAbilitiesFor({ role: 'ADMIN' })

const userCanInviteSomeneElse = ability.can('get', 'projects')

console.log(userCanInviteSomeneElse)
