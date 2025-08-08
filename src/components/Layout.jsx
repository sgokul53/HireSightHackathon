import    { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Bell, User, LogOut, Settings, Edit, Menu, X, MoreVertical, Search, ArrowLeft, Camera } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'
import Modal from './Modal'
import NotificationDropdown from './NotificationDropdown'
import SearchBar from './SearchBar'
import AIAssistant from './AIAssistant'
import { useAutoLogout } from '../hooks/useAutoLogout'     

const   Layout = ({ children, sidebarItems = [], showBackButton = false, onBackClick }) => {
  const { user, logout, updateUser } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showMoreModal, setShowMoreModal] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [messageNotifications, setMessageNotifications] = useState([])
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.displayEmail || user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  })
  
  useAutoLogout(5) // Auto logout after 5 minutes of inactivity 

  useEffect(() => {
    const handleNotificationOpen = () => {
      setShowUserMenu(false)
    }
    
    // Check for new messages every 3 seconds
    const checkMessages = () => {
      const messages = JSON.parse(localStorage.getItem('hiresight_messages') || '[]')
      const userMessages = messages.filter(msg => 
        msg.to === user?.specialId && 
        !msg.read &&
        Date.now() - new Date(msg.timestamp).getTime() < 10000 // New messages within 10 seconds
      )
      setMessageNotifications(userMessages)
    }
    
    const messageInterval = setInterval(checkMessages, 3000)
    
    document.addEventListener('notification-opened', handleNotificationOpen)
    return () => {
      document.removeEventListener('notification-opened', handleNotificationOpen)
      clearInterval(messageInterval)
    }
  }, [user]) 

  const handleSaveProfile = () => {
    updateUser({
      ...editForm,
      displayEmail: editForm.email // Save the edited email as display email
    })
    setShowEditModal(false)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const photoUrl = e.target.result
        localStorage.setItem(`profilePhoto_${user.email}`, photoUrl)
        updateUser({ profilePhoto: photoUrl })
      }
      reader.readAsDataURL(file)
    }
  } 

   return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                     <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-40"> 
        <div className="max-w-full px-4 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16"> 
                       <div className="flex items-center space-x-4">
              <Logo />
            </div> 
            
                                  <div className="flex items-center space-x-2 sm:space-x-3">
              <SearchBar />
              <ThemeToggle /> 
              
              {/* Real-time message notifications */}
              {messageNotifications.length > 0 && (
                <div className="relative">
                  <div className="animate-bounce bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {messageNotifications.length} new message{messageNotifications.length > 1 ? 's' : ''}
                  </div>
                </div>
              )}
              
                           <NotificationDropdown onOpen={() => setShowUserMenu(false)} /> 
              
              <div className="relative"> 
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu)
                    if (!showUserMenu) {
                      document.dispatchEvent(new CustomEvent('user-menu-opened'))
                    }
                  }}
                  className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-600"
                > 
                                   <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                  <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">{user?.name}</span> 
                </button> 
                
                               {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 dropdown-container entering"> 
                                       <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center overflow-hidden">
                          {user?.profilePhoto ? (
                            <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                                 <div>
            <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.displayEmail || user?.email}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400">ID: {user?.specialId}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 capitalize">{user?.role}</p>
          </div> 
                      </div>
                    </div> 
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowEditModal(true)
                          setShowUserMenu(false)
                        }}
                        className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Edit Profile</span>
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2 p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

           <div className="flex flex-col lg:flex-row">
               <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} lg:block ${sidebarCollapsed ? 'hidden' : 'block'} sm:hidden lg:block bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl h-screen shadow-xl border-r border-white/30 dark:border-gray-700/50 sidebar glass-effect fixed top-14 sm:top-16 left-0 z-30 transition-all duration-500 ease-in-out`}> 
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
          <nav className="mt-4 px-4">
            <div className="space-y-2">
              {sidebarItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                                   className={`sidebar-item ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} ${
                    item.active 
                      ? 'active' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`} 
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                </button>
              ))}
            </div>
          </nav>
        </aside>

               <main className={`flex-1 p-4 sm:p-6 pt-20 sm:pt-24 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'} ml-0 transition-all duration-500 min-h-screen`}>
          {children}
               </main> 
      </div>
      
      <AIAssistant />

           <Modal 
        isOpen={showMoreModal}
        onClose={() => setShowMoreModal(false)}
        title="User Information"
      >
        <div className="space-y-4">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{user?.name}</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Special ID:</span>
              <span className="text-sm text-gray-900 dark:text-white">{user?.specialId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</span>
              <span className="text-sm text-gray-900 dark:text-white">{user?.name}</span>
            </div>
                       <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
              <span className="text-sm text-gray-900 dark:text-white">{user?.displayEmail || user?.email}</span>
            </div> 
            <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-600">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Role:</span>
              <span className="text-sm text-gray-900 dark:text-white capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
              <span className="text-sm text-green-600 dark:text-green-400">Active</span>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    const photoUrl = e.target.result
                    localStorage.setItem(`profilePhoto_${user.email}`, photoUrl)
                    updateUser({ profilePhoto: photoUrl })
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={() => {
                setShowMoreModal(false)
                setShowEditModal(true)
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </Modal> 

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
                   <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            />
          </div> 
          <div className="flex space-x-2 pt-4">
            <button
              onClick={handleSaveProfile}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Layout
 