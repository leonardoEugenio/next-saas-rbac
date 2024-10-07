import { defineAbilitiesFor } from "@saas/auth";

const ability = defineAbilitiesFor({ role: 'ADMIN' })

const userCanInviteSomeneElse = ability.can('invite', 'User')

console.log(userCanInviteSomeneElse)