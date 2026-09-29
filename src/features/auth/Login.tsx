import { useEffect, useState } from 'react'
import AppLink from '@/shared/ui/AppLink'
import { getSession, saveSession, validateCredentials } from './auth'
import { navigate } from '@/shared/lib/router'

interface FormErrors {
  username?: string
  password?: string
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [rejected, setRejected] = useState(false)

  useEffect(() => {
    if (getSession()) navigate('/admin')
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nextErrors: FormErrors = {}
    if (!username.trim()) nextErrors.username = 'Username is required'
    if (!password) nextErrors.password = 'Password is required'

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setRejected(false)
      return
    }
    if (!validateCredentials(username, password)) {
      setErrors({})
      setRejected(true)
      return
    }
    saveSession(username.trim())
    navigate('/admin')
  }

  const handleUsernameChange = (value: string) => {
    setUsername(value)
    setRejected(false)
    setErrors((prev) => ({ ...prev, username: undefined }))
  }

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    setRejected(false)
    setErrors((prev) => ({ ...prev, password: undefined }))
  }

  const inputClass = (hasError?: boolean) =>
    `w-full min-h-[48px] px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <AppLink
          to="/"
          className="inline-flex items-center min-h-[44px] text-sm text-gray-600 hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
        >
          Back to portfolio
        </AppLink>

        <div className="mt-2 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
            Admin <span className="text-primary">login</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
            Sign in to open the local dashboard. Your session is stored in this
            browser only and is never sent anywhere.
          </p>

          <form
            className="mt-6 space-y-5"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Admin login form"
          >
            {rejected && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3" role="alert">
                <p className="text-sm text-red-700">
                  That username and password combination does not match.
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="login-username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="login-username"
                name="username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                required
                autoComplete="username"
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'login-username-error' : undefined}
                className={inputClass(!!errors.username)}
                placeholder="Your username"
              />
              {errors.username && (
                <p id="login-username-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="login-password"
                name="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                className={inputClass(!!errors.password)}
                placeholder="Your password"
              />
              {errors.password && (
                <p id="login-password-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full min-h-[48px] bg-primary hover:bg-primary-800 text-white font-semibold rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500 leading-relaxed">
            Demo credentials are defined in src/lib/auth.ts. This gate is for
            show only, anyone can read them in the source.
          </p>
        </div>
      </div>
    </div>
  )
}
