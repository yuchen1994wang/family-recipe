import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 默认密码哈希：940410 的 SHA-1 哈希值
const DEFAULT_PASSWORD_HASH = '8e924a81bcbbf4f15675b0b2752b37ca00d6be52'

// 简单的 SHA-1 哈希函数
async function sha1(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

interface AuthStore {
  passwordHash: string
  isAuthenticated: boolean
  login: (password: string) => Promise<boolean>
  logout: () => void
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      passwordHash: DEFAULT_PASSWORD_HASH,
      isAuthenticated: false,

      login: async (password: string) => {
        const hash = await sha1(password)
        if (hash === get().passwordHash) {
          set({ isAuthenticated: true })
          return true
        }
        return false
      },

      logout: () => set({ isAuthenticated: false }),

      changePassword: async (oldPassword: string, newPassword: string) => {
        const oldHash = await sha1(oldPassword)
        if (oldHash !== get().passwordHash) {
          return false
        }
        const newHash = await sha1(newPassword)
        set({ passwordHash: newHash })
        return true
      },
    }),
    {
      name: 'family-recipes-auth',
    }
  )
)
