import { createContext, useEffect, useState, type ReactNode } from 'react'

type TAuthContext = {
  session: null | SessionAPIResponse
  isLoading: boolean
  save: (data: SessionAPIResponse) => void
  remove: () => void
}

const LOCAL_STORAGE_KEY = '@HelpDesk'

const LOCAL_STORAGE_USER = `${LOCAL_STORAGE_KEY}:user`
const LOCAL_STORAGE_TOKEN = `${LOCAL_STORAGE_KEY}:token`

export const AuthContext = createContext({} as TAuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<null | SessionAPIResponse>(null)
  const [isLoading, setIsLoading] = useState(true)

  function save(data: SessionAPIResponse) {
    setSession(data)

    localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(data.user))
    localStorage.setItem(LOCAL_STORAGE_TOKEN, data.token)
  }

  function remove() {
    setSession(null)

    localStorage.removeItem(LOCAL_STORAGE_USER)
    localStorage.removeItem(LOCAL_STORAGE_TOKEN)
  }

  function loadUser() {
    const user = localStorage.getItem(LOCAL_STORAGE_USER)
    const token = localStorage.getItem(LOCAL_STORAGE_TOKEN)

    if (user && token) {
      setSession({ token, user: JSON.parse(user) })
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
