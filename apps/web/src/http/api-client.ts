import ky from 'ky'

export const api = ky.extend({
  prefixUrl: 'https://next-saas-rbac-nru1.onrender.com/',
})
