import { useState } from 'react'
import { useLogin } from '../hooks/useAuth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return (
    <div className="w-full max-w-md">
      <fieldset className="border-2 border-gray-400 p-4">
        <legend className="px-2 font-bold">Login</legend>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username:
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          {loginMutation.error && (
            <div className="text-red-600 text-sm">
              {loginMutation.error instanceof Error 
                ? loginMutation.error.message 
                : 'Login failed'}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loginMutation.isPending ? 'Logging in...' : 'Login'}
          </button>
          
          <div className="text-center">
            <a href="#" className="text-xs text-blue-600 hover:bg-schedule-hover">
              Forgot Password
            </a>
          </div>
        </form>
      </fieldset>
    </div>
  )
}