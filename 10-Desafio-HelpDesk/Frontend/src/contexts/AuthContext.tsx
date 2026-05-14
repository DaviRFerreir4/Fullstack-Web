import { createContext, useEffect, useState, type ReactNode } from 'react'
import { api } from '../services/api'
import type { CreateSessionAPIResponse } from '../dtos/user'
import { clearProfilePicturesCache } from '../hooks/components/useProfilePictureLogic'

export type AuthContextType = {
  session: CreateSessionAPIResponse | null
  isLoading: boolean
  save: (data: CreateSessionAPIResponse) => void
  remove: () => void
}

const LOCAL_STORAGE_KEY = '@HelpDesk'

const LOCAL_STORAGE_USER = `${LOCAL_STORAGE_KEY}:user`
const LOCAL_STORAGE_TOKEN = `${LOCAL_STORAGE_KEY}:token`

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthContextType['session']>(null)
  const [isLoading, setIsLoading] = useState(true)

  function save(data: CreateSessionAPIResponse) {
    const { token, user } = data

    const session: CreateSessionAPIResponse = {
      token,
      user: { id: user.id, name: user.name, role: user.role },
    }

    setSession(session)

    localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(session.user))
    localStorage.setItem(LOCAL_STORAGE_TOKEN, session.token)

    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
  }

  async function remove() {
    await clearProfilePicturesCache()

    setSession(null)

    localStorage.removeItem(LOCAL_STORAGE_USER)
    localStorage.removeItem(LOCAL_STORAGE_TOKEN)

    delete api.defaults.headers.common['Authorization']
  }

  function loadUser() {
    const user = localStorage.getItem(LOCAL_STORAGE_USER)
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN)

    if (user && token) {
      setSession({ token, user: JSON.parse(user) })
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <AuthContext.Provider value={{ session, isLoading, save, remove }}>
      {children}
    </AuthContext.Provider>
  )
}
