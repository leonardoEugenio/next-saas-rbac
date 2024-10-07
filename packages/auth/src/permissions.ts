import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from '.'
import { User } from './models/user'

type Role = 'ADMIN' | 'MEMBER'

type PermissionsByRole = (
    user: User,
    builder: AbilityBuilder<AppAbility>,
 ) => void

export const permissions: Record<Role, PermissionsByRole> = {
    ADMIN(_, { can }) {
        can('menage', 'User'),
        can('invite', 'User')
    },

    MEMBER(_, { can }) {
        can('invite', 'User')
    }
}