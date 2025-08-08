import  { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

export const useAutoLogout = (timeoutMinutes = 5) => {
  const { logout, user } = useAuth()
  const timeoutRef = useRef(null)
  const lastActivityRef = useRef(Date.now())

  const resetTimer = () => {
    lastActivityRef.current = Date.now()
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      if (user) {
        logout()
      }
    }, timeoutMinutes * 60 * 1000)
  }

  useEffect(() => {
    if (!user) return

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => {
      resetTimer()
    }

    // Set up event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initial timer setup
    resetTimer()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [user, timeoutMinutes, logout])

  return resetTimer
}
 