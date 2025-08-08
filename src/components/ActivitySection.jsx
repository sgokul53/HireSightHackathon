import   { useState, useEffect } from 'react'
import  { Activity, Clock, Star, Eye, Shield, Trash, BarChart3, FileText, Mail, User, Share } from 'lucide-react'
import { activityService } from '../services/activityService'
import { useAuth } from '../context/AuthContext'  

const  ActivitySection = ({ userRole }) => {
  const { user } = useAuth()
  const [activeView, setActiveView] = useState('recent')
  const [recentActivity, setRecentActivity] = useState([])
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem(`savedItems_${user?.email}`)
    return saved ? JSON.parse(saved) : []
  }) 

   const [usageStats, setUsageStats] = useState(() => {
    const stats = localStorage.getItem(`usageStats_${user?.email}`)
    return stats ? JSON.parse(stats) : {
      screenTime: '0h 0m',
      sessionsToday: 1,
      documentsProcessed: 0,
      emailsSent: 0
    }
  })

   useEffect(() => {
    const loadActivities = () => {
      const activities = activityService.getRecentActivities(10)
      setRecentActivity(activities)
    }

    loadActivities()
    
    // Initialize session start time
    if (!localStorage.getItem(`sessionStart_${user?.email}`)) {
      localStorage.setItem(`sessionStart_${user?.email}`, Date.now().toString())
    }
    
    // Update screen time every minute
    const interval = setInterval(() => {
      updateUsageStats()
    }, 60000)
    
    const handleNewActivity = () => {
      loadActivities()
      updateUsageStats()
    }

    window.addEventListener('newActivity', handleNewActivity)
    return () => {
      window.removeEventListener('newActivity', handleNewActivity)
      clearInterval(interval)
    }
  }, [user?.email]) 

  useEffect(() => {
    localStorage.setItem(`savedItems_${user?.email}`, JSON.stringify(savedItems))
  }, [savedItems, user?.email])

  const updateUsageStats = () => {
    const currentStats = JSON.parse(localStorage.getItem(`usageStats_${user?.email}`) || '{}')
    const activities = activityService.getRecentActivities(100)
    
    const today = new Date().toDateString()
    const todayActivities = activities.filter(activity => 
      new Date(activity.timestamp).toDateString() === today
    )
    
    const newStats = {
      screenTime: calculateScreenTime(),
      sessionsToday: currentStats.sessionsToday || 1,
      documentsProcessed: activities.filter(a => a.type === 'upload' || a.type === 'analysis').length,
      emailsSent: activities.filter(a => a.type === 'email').length
    }
    
    setUsageStats(newStats)
    localStorage.setItem(`usageStats_${user?.email}`, JSON.stringify(newStats))
  }

  const calculateScreenTime = () => {
    const sessionStart = localStorage.getItem(`sessionStart_${user?.email}`)
    if (sessionStart) {
      const elapsed = Date.now() - parseInt(sessionStart)
      const hours = Math.floor(elapsed / 3600000)
      const minutes = Math.floor((elapsed % 3600000) / 60000)
      return `${hours}h ${minutes}m`
    }
    return '0h 0m'
  } 

   const removeSavedItem = (itemId) => {
    setSavedItems(items => items.filter(item => item.id !== itemId))
  }

  const saveCurrentItem = (title, type) => {
    const newItem = {
      id: Date.now(),
      title,
      type,
      saved: 'Just now'
    }
    setSavedItems(items => [newItem, ...items])
  } 

  const getActivityIcon = (type) => {
    switch(type) {
      case 'upload': return <FileText className="w-4 h-4 text-blue-600" />
      case 'analysis': return <BarChart3 className="w-4 h-4 text-purple-600" />
      case 'email': return <Mail className="w-4 h-4 text-green-600" />
      case 'share': return <Share className="w-4 h-4 text-orange-600" />
      case 'application': return <User className="w-4 h-4 text-indigo-600" />
      default: return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const renderContent = () => {
    switch(activeView) {
      case 'recent':
        return (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.user} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'saved':
        return (
          <div className="space-y-4">
            {savedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.type} • Saved {item.saved}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeSavedItem(item.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
            {savedItems.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No saved items</p>
            )}
          </div>
        )
      
      case 'usage':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-blue-600">{usageStats.screenTime}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Screen Time</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-600">{usageStats.sessionsToday}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Sessions Today</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-purple-600">{usageStats.documentsProcessed}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Documents Processed</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <Mail className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-orange-600">{usageStats.emailsSent}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Emails Sent</p>
              </div>
            </div>
          </div>
        )
      
      case 'privacy':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-800 dark:text-green-200">Security Status</h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">All systems secure and encrypted</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Data Encryption</span>
                <span className="text-sm text-green-600 font-medium">Enabled</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Auto Logout</span>
                <span className="text-sm text-blue-600 font-medium">30 minutes</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Session Tracking</span>
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Data Backup</span>
                <span className="text-sm text-green-600 font-medium">Daily</span>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Activity Center</h3>
        
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveView('recent')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === 'recent'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Recent Activity
          </button>
          <button
            onClick={() => setActiveView('saved')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === 'saved'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Saved Items
          </button>
          <button
            onClick={() => setActiveView('usage')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === 'usage'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Usage Stats
          </button>
          <button
            onClick={() => setActiveView('privacy')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeView === 'privacy'
                ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Privacy
          </button>
        </div>
        
        {renderContent()}
      </div>
    </div>
  )
}

export default ActivitySection
 