import api, { isMockMode } from './api'
import { readSession, writeSession } from './token'
import { demoUsers, findDemoUserByEmail } from '../data/users'
import { ROLES } from '../constants'

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  companyId: user.companyId,
  status: user.status,
  joinedAt: user.joinedAt,
  color: user.color,
})

const publicUser = (user) => {
  const { password: _password, ...rest } = user
  return rest
}

export const authService = {
  currentUser: () => readSession()?.user || null,

  async login({ email, password }) {
    if (isMockMode) {
      const user = findDemoUserByEmail(email)
      if (!user || user.password !== password) {
        throw new Error('Invalid email or password (demo password: demo1234)')
      }
      if (user.status !== 'ACTIVE') throw new Error('This account is inactive.')
      const session = {
        user: normalizeUser(user),
        token: `demo-token-${user.id}`,
        role: user.role,
      }
      writeSession(session)
      return session
    }
    const { data } = await api.post('/login', { email, password })
    writeSession({ user: data.user, token: data.token, role: data.user?.role })
    return readSession()
  },

  async register(payload) {
    if (isMockMode) {
      const session = {
        user: normalizeUser({
          ...payload,
          id: `usr-${Date.now().toString(36)}`,
          name: { en: payload.name, km: payload.name },
          role: ROLES.CUSTOMER,
          status: 'ACTIVE',
          joinedAt: new Date().toISOString().slice(0, 10),
          color: '#2563eb',
        }),
        token: `demo-token-${Date.now()}`,
        role: ROLES.CUSTOMER,
      }
      writeSession(session)
      return session
    }
    const { data } = await api.post('/register', payload)
    writeSession({ user: data.user, token: data.token, role: data.user?.role })
    return readSession()
  },

  async logout() {
    if (!isMockMode) {
      try {
        await api.post('/logout')
      } catch {
        // Clearing the local session still succeeds offline.
      }
    }
    writeSession(null)
  },

  async me() {
    if (isMockMode) return authService.currentUser()
    const { data } = await api.get('/user')
    return data
  },

  async updateProfile(updates) {
    const session = readSession()
    if (!session) throw new Error('No active session')
    if (isMockMode) {
      const next = {
        ...session,
        user: {
          ...session.user,
          ...updates,
          name:
            typeof updates.name === 'string'
              ? { en: updates.name, km: updates.name }
              : updates.name || session.user.name,
        },
      }
      writeSession(next)
      return next.user
    }
    const { data } = await api.patch('/user', updates)
    return data
  },

  // Used by the login page to display demo credentials.
  demoAccounts: () => demoUsers.map(publicUser),
}
