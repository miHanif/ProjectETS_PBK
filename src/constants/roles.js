export const USER_ROLES = Object.freeze({
  OWNER: 'pemilik',
  ASSISTANT: 'asisten',
})

export const USER_ROLE_OPTIONS = Object.freeze([
  Object.freeze({ label: 'Pemilik', value: USER_ROLES.OWNER }),
  Object.freeze({ label: 'Asisten', value: USER_ROLES.ASSISTANT }),
])
