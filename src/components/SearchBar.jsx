import   { useState, useEffect } from 'react'
import { Search, X, User, Briefcase, FileText, Settings, MessageCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { jobDescriptions } from '../data/jobDescriptions' 

const  SearchBar = ({ onFeatureNavigate }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showUserPopup, setShowUserPopup] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const { user } = useAuth() 

   const userDatabase = {
    'REC001': {
      email: 'gokul.reply@gmail.com', 
      id: 'REC001', 
      name: 'Gokul Kumar', 
      email: 'gokul.recruiter@gmail.com', 
      role: 'Recruiter', 
      experience: '5 years in talent acquisition',
      department: 'HR Department'
    },
    'REC002': { 
      id: 'REC002', 
      name: 'Govardhnan', 
      email: 'govardhnan.recruiter@gmail.com', 
      role: 'Senior Recruiter', 
      experience: '7 years in recruitment',
      department: 'HR Department'
    },
    'REQ001': { 
      id: 'REQ001', 
      name: 'Harini Krishnan', 
      email: 'harini.requestor@gmail.com', 
      role: 'AR Requestor', 
      experience: '4 years in project management',
      department: 'Operations'
    },
    'REQ002': { 
      id: 'REQ002', 
      name: 'Kovarthini', 
      email: 'kovarthini.requestor@gmail.com', 
      role: 'Senior AR Requestor', 
      experience: '6 years in operations',
      department: 'Operations'
    }
  }

  const searchData = {
    recruiter: [
      { ...userDatabase['REC001'], type: 'user', icon: User },
      { ...userDatabase['REC002'], type: 'user', icon: User },
      { ...userDatabase['REQ001'], type: 'user', icon: User },
      { ...userDatabase['REQ002'], type: 'user', icon: User },
      { name: 'Upload Files', type: 'feature', action: 'upload', icon: FileText },
      { name: 'Applications', type: 'feature', action: 'applications', icon: User },
      { name: 'AI Ranking', type: 'feature', action: 'ai-ranking', icon: Settings },
      { name: 'Resume Ranking', type: 'feature', action: 'ranking', icon: Settings }
    ],
    requestor: [
      { ...userDatabase['REC001'], type: 'user', icon: User },
      { ...userDatabase['REC002'], type: 'user', icon: User },
      { ...userDatabase['REQ001'], type: 'user', icon: User },
      { ...userDatabase['REQ002'], type: 'user', icon: User },
      { name: 'Workflow Status', type: 'feature', action: 'workflow', icon: Settings },
      { name: 'Ranking Tables', type: 'feature', action: 'rankings', icon: FileText },
      { name: 'Shared Resumes', type: 'feature', action: 'shared-resumes', icon: FileText }
    ],
    candidate: Object.entries(jobDescriptions).map(([key, job]) => ({
      name: job.title,
      type: 'job',
      key,
      icon: Briefcase,
      ...job
    }))
  } 

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const data = searchData[user?.role] || []
    const filtered = data.filter(item => 
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.id?.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered.slice(0, 5))
  }, [query, user?.role])

   const handleResultClick = (result) => {
    if (result.type === 'user') {
      setSelectedUser(result)
      setShowUserPopup(true)
      setIsOpen(false)
    } else if (result.type === 'feature') {
      window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: result.action }))
      setIsOpen(false)
      setQuery('')
    } else if (result.type === 'job') {
      window.dispatchEvent(new CustomEvent('navigate-to-job', { detail: result }))
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleMessageUser = () => {
    window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'messages' }))
    setShowUserPopup(false)
    setSelectedUser(null)
  } 

   return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 shadow-sm border border-gray-200 dark:border-gray-600"
      >
        <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 dropdown-container entering">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={user?.role === 'candidate' ? 'Search for jobs...' : 'Search users or features...'}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {results.length > 0 ? (
              results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <result.icon className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{result.name}</p>
                    {result.id && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">ID: {result.id}</p>
                    )}
                    {result.type === 'job' && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">{result.department}</p>
                    )}
                  </div>
                </button>
              ))
            ) : query.trim() ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No matches found
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                {user?.role === 'candidate' ? 'Type to search for jobs' : 'Type to search users or features'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Info Popup */}
      {showUserPopup && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" onClick={() => setShowUserPopup(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-96 max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Information</h3>
              <button
                onClick={() => setShowUserPopup(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Name:</span>
                <span className="text-sm text-gray-900 dark:text-white">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email:</span>
                <span className="text-sm text-gray-900 dark:text-white">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Role:</span>
                <span className="text-sm text-gray-900 dark:text-white">{selectedUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Experience:</span>
                <span className="text-sm text-gray-900 dark:text-white">{selectedUser.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Department:</span>
                <span className="text-sm text-gray-900 dark:text-white">{selectedUser.department}</span>
              </div>
            </div>
            
            
          </div>
        </div>
      )}
    </div>
  ) 
}

export default SearchBar
 