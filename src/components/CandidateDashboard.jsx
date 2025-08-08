import  { useState } from 'react'
import  { Upload, FileText, BarChart3, Bell, ChevronDown, User, Settings, LogOut, CheckCircle } from 'lucide-react'
import ProfileEditor from './ProfileEditor' 

const CandidateDashboard = ({ user }) => {
  const [selectedRole, setSelectedRole] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [geminiConsent, setGeminiConsent] = useState(false)
  const [geminiAnalysis, setGeminiAnalysis] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
   const [notifications] = useState([
    { id: 1, message: 'Resume analysis complete', time: '5 min ago' },
    { id: 2, message: 'Profile viewed by recruiter', time: '1 hour ago' },
    { id: 3, message: 'Application submitted successfully', time: '2 hours ago' }
  ])
  const [applications, setApplications] = useState([
    { id: 1, role: 'Software Engineer', company: 'TechCorp', status: 'Under Review', date: '2024-01-15' },
    { id: 2, role: 'Frontend Developer', company: 'WebSolutions', status: 'Interview Scheduled', date: '2024-01-12' }
  ])
   const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileEditor, setShowProfileEditor] = useState(false)
  const [userProfile, setUserProfile] = useState(user) 
 

  const jobRoles = [
    'Software Engineer',
    'Data Analyst', 
    'Data Scientist',
    'Frontend Developer',
    'DevOps Engineer'
  ]

  const analyzeResume = async () => {
    if (!selectedRole || !resumeFile) return
    
    setProcessing(true)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockKeywords = {
      'JavaScript': 15,
      'React': 12,
      'Python': 10,
      'Node.js': 8,
      'HTML': 7,
      'CSS': 6
    }
    
    const mockScore = Math.floor(Math.random() * 30) + 65
    const interpretation = mockScore >= 80 ? 'Strong Match' : 
                          mockScore >= 70 ? 'Moderate Match' : 'Weak Match'
    
    setAnalysis({
      keywords: mockKeywords,
      score: mockScore,
      interpretation,
      preview: `Experienced ${selectedRole} with strong background in software development...`
    })
    
    if (geminiConsent) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setGeminiAnalysis({
        summary: `This candidate shows excellent potential for the ${selectedRole} position with ${mockScore}% compatibility.`,
        tips: [
          'Consider adding more cloud computing experience',
          'Highlight project management skills'
        ]
      })
    }
    
    setProcessing(false)
  }

   const canApply = analysis && analysis.score > 75

  const handleApplyForJob = () => {
    if (canApply) {
      // Simulate sending application to recruiter
      const newApplication = {
        id: applications.length + 1,
        role: selectedRole,
        company: 'Recruitment Platform',
        status: 'Submitted',
        date: new Date().toISOString().split('T')[0]
      }
      setApplications([newApplication, ...applications])
      
      // Show success notification
      const successNotification = {
        id: notifications.length + 1,
        message: `Application submitted for ${selectedRole}`,
        time: 'Just now'
      }
      // Would update notifications state here
    }
  }
 

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Candidate Panel</h2>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center px-6 py-3 text-blue-600 bg-blue-50 dark:bg-blue-900/20">
            <User className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FileText className="w-5 h-5 mr-3" />
            Resume Analysis
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Candidate Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell 
                  className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
                  onClick={() => setShowNotifications(!showNotifications)}
                />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.length}
                </span>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-600 z-50">
                    <div className="p-3 border-b dark:border-gray-600">
                      <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b dark:border-gray-600 last:border-b-0">
                          <div className="text-sm text-gray-900 dark:text-white">{notification.message}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <div
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <User className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-gray-500 dark:text-gray-400">{user.role}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-600">
                    <div className="p-3 border-b dark:border-gray-600">
                      <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">ID: {user.id}</div>
                    </div>
                                       <button 
                      onClick={() => setShowProfileEditor(true)}
                      className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button> 
                    <a href="#" className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upload Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Job Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Choose a role...</option>
                      {jobRoles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Resume (PDF)
                    </label>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="gemini"
                      checked={geminiConsent}
                      onChange={(e) => setGeminiConsent(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="gemini" className="text-sm text-gray-700 dark:text-gray-300">
                      Get AI feedback using Gemini (optional)
                    </label>
                  </div>
                  <button
                    onClick={analyzeResume}
                    disabled={!selectedRole || !resumeFile || processing}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors"
                  >
                    {processing ? 'Analyzing...' : 'Analyze Resume'}
                  </button>
                </div>
              </div>

              {/* Results */}
              {analysis && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analysis Results</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Resume Preview</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{analysis.preview}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Keyword Frequency</h4>
                      <div className="space-y-2">
                        {Object.entries(analysis.keywords).map(([keyword, count]) => (
                          <div key={keyword} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-300">{keyword}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{width: `${(count/15) * 100}%`}}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${
                      analysis.score >= 80 ? 'bg-green-50 dark:bg-green-900/20' :
                      analysis.score >= 70 ? 'bg-yellow-50 dark:bg-yellow-900/20' :
                      'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Similarity Score</h4>
                          <p className={`text-sm ${
                            analysis.score >= 80 ? 'text-green-600 dark:text-green-400' :
                            analysis.score >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {analysis.interpretation}
                          </p>
                        </div>
                        <div className={`text-2xl font-bold ${
                          analysis.score >= 80 ? 'text-green-600 dark:text-green-400' :
                          analysis.score >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {analysis.score}%
                        </div>
                      </div>
                    </div>

                    {canApply && (
                      <button 
                        onClick={handleApplyForJob}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Apply for Job Role
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Gemini Analysis */}
              {geminiAnalysis && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Feedback</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Summary</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{geminiAnalysis.summary}</p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <h4 className="font-medium text-purple-900 dark:text-purple-300 mb-2">Improvement Tips</h4>
                      <ul className="space-y-1">
                        {geminiAnalysis.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-purple-800 dark:text-purple-200">• {tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
                    <span className="font-semibold text-gray-900 dark:text-white">23</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Applications</span>
                    <span className="font-semibold text-gray-900 dark:text-white">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Avg Score</span>
                    <span className="font-semibold text-gray-900 dark:text-white">78%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application History</h3>
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="border-l-4 border-blue-500 pl-3 py-2">
                      <div className="font-medium text-gray-900 dark:text-white">{app.role}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{app.company}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          app.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{app.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
               </main>
      </div>
      
      {showProfileEditor && (
        <ProfileEditor
          user={userProfile}
          onSave={(updatedProfile) => {
            setUserProfile({ ...userProfile, ...updatedProfile })
            setShowProfileEditor(false)
          }}
          onCancel={() => setShowProfileEditor(false)}
        />
      )}
    </div>
  ) 
}

export default CandidateDashboard
 