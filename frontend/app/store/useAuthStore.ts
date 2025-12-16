import { create } from 'zustand'

type User = {
  id: string
  email: string
  picture: string
  created_at: string
}

type AuthState = {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null
    }),

  logout: async () => {
    // Clear the JWT token cookie by calling the backend logout endpoint
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/oauth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Error during logout:', error)
    }
    
    // Clear the in-memory state
    set({
      user: null,
      isAuthenticated: false,
    })
  },

    
}))
