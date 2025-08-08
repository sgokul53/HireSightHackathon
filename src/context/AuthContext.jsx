import  { createContext, useContext, useState } from 'react'
import { trackLogin } from '../services/activityService' 

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export  const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (credentials, selectedRole) => {
    const users = {
      'gokul.recruiter@gmail.com': { password: 'recruit@123', role: 'recruiter', name: 'Gokul Kumar', specialId: 'REC001' },
      'govarthanan14@gmail.com': { password: 'gova@123', role: 'recruiter', name: 'Govardhnan', specialId: 'REC002' },
      'harini.requestor@gmail.com': { password: 'harinik@123', role: 'requestor', name: 'Harini Krishnan', specialId: 'REQ001' },
      'kovarthini.requestor@gmail.com': { password: 'kova@123', role: 'requestor', name: 'Kovarthini', specialId: 'REQ002' },
      'candidate@gmail.com': { password: 'candi@123', role: 'candidate', name: 'John Candidate', specialId: 'CAN001' }
    }

    // Check registered candidates
    const registeredCandidates = JSON.parse(localStorage.getItem('candidates') || '{}')
    const allUsers = { ...users, ...registeredCandidates }

    const userData = allUsers[credentials.email]
    if (userData && userData.password === credentials.password && userData.role === selectedRole) {
      // Get saved profile data
      const savedProfile = JSON.parse(localStorage.getItem(`profileData_${credentials.email}`) || '{}')
      
      setUser({ 
        ...userData,
        ...savedProfile, // Override with saved profile data
        email: credentials.email, // Keep original login email
        profilePhoto: localStorage.getItem(`profilePhoto_${credentials.email}`) || null,
        loginTime: new Date().getTime()
      })
      return { success: true }
    }
    return { success: false }
  } 

  const logout = () => setUser(null)

   const updateUser = (data) => {
    setUser(prev => {
      const updatedUser = { ...prev, ...data }
      // Save profile data to localStorage (excluding login credentials)
      const profileData = {
        name: updatedUser.name,
        displayEmail: data.displayEmail || updatedUser.displayEmail || updatedUser.email,
        phone: updatedUser.phone,
        location: updatedUser.location,
        bio: updatedUser.bio
      }
      localStorage.setItem(`profileData_${updatedUser.email}`, JSON.stringify(profileData))
      return updatedUser
    })
  } 

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
 