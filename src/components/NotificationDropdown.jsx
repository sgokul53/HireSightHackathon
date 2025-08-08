import   { useState, useEffect } from 'react'
import { Bell, X } from 'lucide-react'

const NotificationDropdown = ({ onOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    const handleUserMenuOpen = () => {
      setShowNotifications(false)
    }
    
    document.addEventListener('user-menu-opened', handleUserMenuOpen)
    return () => document.removeEventListener('user-menu-opened', handleUserMenuOpen)
  }, []) 
  
  const notifications = [
    { id: 1, title: 'New resume uploaded', message: 'John Doe has submitted a resume for Software Engineer position', time: '5 min ago', unread: true },
    { id: 2, title: 'Interview scheduled', message: 'Interview with Sarah Johnson scheduled for tomorrow at 2 PM', time: '1 hour ago', unread: true },
    { id: 3, title: 'Application status update', message: 'Mike Chen\'s application has been moved to final review', time: '2 hours ago', unread: false },
    { id: 4, title: 'New job posting', message: 'Senior Frontend Developer position has been posted', time: '4 hours ago', unread: false },
    { id: 5, title: 'Resume analysis complete', message: 'Analysis results for 12 candidates are now available', time: '6 hours ago', unread: false }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setShowNotifications(!showNotifications)
          if (!showNotifications) {
            document.dispatchEvent(new CustomEvent('notification-opened'))
            onOpen?.()
          }
        }}
        className="p-1.5 sm:p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 relative shadow-sm border border-gray-200 dark:border-gray-600"
      > 
               <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" /> 
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

           {showNotifications && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 lg:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 dropdown-container entering"> 
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                  notification.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button className="w-full text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
 