import { createContext, useState, type ReactNode } from 'react'

type TAuthContext = {
  session: null | SessionAPIResponse
  save: (data: SessionAPIResponse) => void
}

export const AuthContext = createContext({} as TAuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<null | SessionAPIResponse>(null)

  function save(data: SessionAPIResponse) {
    setSession(data)
  }

  return (
    <AuthContext.Provider value={{ session, save }}>
      {children}
    </AuthContext.Provider>
  )
}
