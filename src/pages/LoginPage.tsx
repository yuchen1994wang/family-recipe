import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock, ChefHat } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuthStore()

  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim()) return

    setLoading(true)
    setError('')

    try {
      const success = await login(password.trim())
      if (success) {
        navigate(from, { replace: true })
      } else {
        setError('密码错误')
      }
    } catch (err) {
      setError('登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-6">
      <div className="mb-12">
        <div className="w-20 h-20 bg-[#C75B39] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ChefHat size={36} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#2C2C2C] text-center">家庭菜谱</h1>
      </div>

      <div className="w-full max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8B8680]" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              autoFocus
              className="w-full pl-12 pr-4 py-4 bg-white border border-[#E8E6E3] rounded-xl text-base text-[#2C2C2C] placeholder:text-[#8B8680] focus:outline-none focus:ring-2 focus:ring-[#C75B39]/30 transition-all"
            />
          </div>

          {error && (
            <p className="text-[#C75B39] text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-4 bg-[#2C2C2C] text-white font-medium rounded-xl hover:bg-[#3a3a3a] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '验证中...' : '进入'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-xs text-[#8B8680]">
        忘记密码？删除浏览器本地存储的 family-recipes-auth 即可重置
      </p>
    </div>
  )
}
