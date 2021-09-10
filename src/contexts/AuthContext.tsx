import { createContext, ReactNode, useState } from "react";
import Router from 'next/router'
import { api } from "../services/api";

type User = {
  email: string
  permissions: string[]
  roles: string[]
}

type SignInCredentials = {
  email: string
  password: string
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>
  user: User
  isAuthenticated: boolean
}

type AuthProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps){
  const [user, setUser] = useState<User>(null)
  const isAuthenticated = !(!user)

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password
      })

      const { token, refreshToken, permissions, roles } = response.data

      // We have to store the tokens even if the user refreshes the page
      // We can store in:
      // sessionStorage: not available in other sessions (e.g. if the user closes the browser)
      // localStorage: only available in browser, bad for NextJS (SSR)
      // cookies: we will use them!!
 
      setUser({
        email,
        permissions,
        roles
      })

      Router.push('/dashboard')
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  )
}