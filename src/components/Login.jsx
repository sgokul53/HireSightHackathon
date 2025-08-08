import  { useState, useEffect } from 'react'
import { Users, User, Settings, Sun, Moon, AlertCircle } from 'lucide-react'

const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState('')
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [darkMode, setDarkMode] = useState(false)
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
 

  const roles = [
    { id: 'recruiter', name: 'Recruiter', icon: Users, desc: 'Upload JDs and rank candidates' },
    { id: 'ar-requestor', name: 'AR Requestor', icon: Settings, desc: 'View dashboard and workflow progress' },
    { id: 'candidate', name: 'Candidate', icon: User, desc: 'Upload resume and get feedback' }
  ]

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

   useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const validateForm = () => {
    const newErrors = {}
    
    if (!selectedRole) {
      newErrors.role = 'Please select a role'
    }
    
    if (!credentials.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!credentials.password) {
      newErrors.password = 'Password is required'
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onLogin({
      role: selectedRole,
      name: credentials.email.split('@')[0],
      email: credentials.email,
      id: `${selectedRole}_${Date.now()}`
    })
    
    setIsLoading(false)
  }
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
      >
        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
      </button>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">AI Recruitment</h1>
          <p className="text-gray-600 dark:text-gray-300">Choose your role to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-3">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedRole === role.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <role.icon className={`w-6 h-6 mt-1 ${selectedRole === role.id ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div>
                    <h3 className={`font-semibold ${selectedRole === role.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                      {role.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{role.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

                   <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => {
                  setCredentials({ ...credentials, email: e.target.value })
                  if (errors.email) setErrors({ ...errors, email: null })
                }}
                className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.email && (
                <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email}
                </div>
              )}
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => {
                  setCredentials({ ...credentials, password: e.target.value })
                  if (errors.password) setErrors({ ...errors, password: null })
                }}
                className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {errors.password && (
                <div className="flex items-center mt-1 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password}
                </div>
              )}
            </div>
          </div>
 

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition-all transform ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95'
            } text-white`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
 