import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, AlertCircle, Users, BarChart3, User, CheckCircle } from 'lucide-react'
import Logo from '../components/Logo'
import ThemeToggle from '../components/ThemeToggle'

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [showRegister, setShowRegister] = useState(false)
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  })
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const roles = [
    { id: 'recruiter', name: 'Recruiter', icon: Users, desc: 'Upload JDs and rank candidates' },
    { id: 'requestor', name: 'Requestor', icon: BarChart3, desc: 'Monitor workflow progress' },
    { id: 'candidate', name: 'Candidate', icon: User, desc: 'Apply and track applications' }
  ]

   const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRole) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }
    
    setLoading(true)
    
    const result = login(credentials, selectedRole)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
    }
    setLoading(false)
  } 

   const handleRegister = (e) => {
    e.preventDefault()
    
    // Generate candidate ID
    const candidateCount = parseInt(localStorage.getItem('candidateCount') || '1')
    const newCandidateId = `CAN${String(candidateCount + 1).padStart(3, '0')}`
    
    // Store new candidate in localStorage
    const existingCandidates = JSON.parse(localStorage.getItem('candidates') || '{}')
    existingCandidates[registerData.email] = {
      password: registerData.password,
      role: 'candidate',
      name: `${registerData.firstName} ${registerData.lastName}`,
      specialId: newCandidateId
    }
    localStorage.setItem('candidates', JSON.stringify(existingCandidates))
    localStorage.setItem('candidateCount', String(candidateCount + 1))
    
    setRegisterSuccess(true)
    setTimeout(() => {
      setRegisterSuccess(false)
      setShowRegister(false)
      setRegisterData({ firstName: '', lastName: '', email: '', password: '' })
    }, 2000)
  } 

   const getRoleCredentials = (role) => {
    const creds = {
      recruiter: [
        { email: 'gokul.recruiter@gmail.com', password: 'recruit@123' },
        { email: 'govarthanan14@gmail.com', password: 'gova@123' }
      ],
      requestor: [
        { email: 'harini.requestor@gmail.com', password: 'harinik@123' },
        { email: 'kovarthini.requestor@gmail.com', password: 'kova@123' }
      ],
      candidate: [
        { email: 'candidate@gmail.com', password: 'candi@123' }
      ]
    }
    return creds[role] || []
  } 
 

         return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex flex-col relative overflow-hidden"> 
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-blue-400/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="absolute top-6 left-6 animate-bounce-in">
        <Logo size="large" />
      </div>
      
      <div className="fixed top-4 right-4 z-50 animate-slide-in">
        <ThemeToggle />
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg w-full space-y-8 animate-fade-in"> 
          {!showRegister ? (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
              </div>

                           <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50 card-hover glass-effect"> 
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {roles.map((role) => (
                                           <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg interactive ${
                          selectedRole === role.id
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 shadow-lg animate-pulse-glow'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      > 
                        <div className="flex items-center space-x-3">
                          <role.icon className="w-5 h-5" />
                          <div className="text-left">
                            <p className="font-medium">{role.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{role.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedRole && (
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                                           <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={credentials.email}
                          onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 placeholder-gray-400"
                          placeholder="Enter your email"
                        />
                      </div> 
                      
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password
                      </label>
                                           <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={credentials.password}
                          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 placeholder-gray-400"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div> 
                    </div>
                    
                                       <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full relative overflow-hidden group disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                    > 
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full w-5 h-5 border-b-2 border-white mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>
                )}

                               <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setShowRegister(true)
                      setSelectedRole('candidate')
                    }}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Don't have an account? Sign Up as Candidate
                  </button>
                </div> 
              </div>
            </>
          ) : (
                                             <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 dark:border-gray-700/50 glass-effect animate-bounce-in"> 
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Candidate Account</h2>
                <p className="text-gray-600 dark:text-gray-400">Join HireSight as a candidate</p>
              </div> 

              {registerSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You can now sign in with your credentials
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                                             <input
                          type="text"
                          required
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 placeholder-gray-400"
                        /> 
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                                             <input
                          type="text"
                          required
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 placeholder-gray-400"
                        /> 
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email ID
                    </label>
                                         <input
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 placeholder-gray-400"
                      /> 
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                                         <input
                        type="password"
                        required
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300 placeholder-gray-400"
                      /> 
                  </div>
                                     <button
                      type="submit"
                      className="btn-primary w-full"
                    > 
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-2"
                  >
                    Back to Sign In
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

           {showError && (
        <div className="modal-backdrop">
          <div className="modal-content max-w-sm animate-bounce-in"> 
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Login Failed</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Invalid mail id or password</p>
              </div>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
 
}

export default Login
 