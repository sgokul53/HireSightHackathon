import  { useState } from 'react'
import { Upload, Download, Mail, FileText, Users, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'

const RecruiterDashboard = ({ user }) => {
  const [jdFile, setJdFile] = useState(null)
  const [resumeFiles, setResumeFiles] = useState([])
  const [ranking, setRanking] = useState([])
  const [processing, setProcessing] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
   const [notifications] = useState([
    { id: 1, message: 'New candidate applied', time: '2 min ago' },
    { id: 2, message: 'Resume analysis completed', time: '5 min ago' },
    { id: 3, message: 'Email sent to top candidates', time: '10 min ago' }
  ])
  const [applications, setApplications] = useState([
    { id: 1, name: 'John Doe', role: 'Software Engineer', score: 85, status: 'pending', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', role: 'Frontend Developer', score: 92, status: 'accepted', email: 'jane@example.com' }
  ])
  const [showNotifications, setShowNotifications] = useState(false)
 

  const handleJDUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setJdFile(file)
    }
  }

  const handleResumeUpload = (e) => {
    const files = Array.from(e.target.files)
    setResumeFiles(files.filter(f => f.type === 'application/pdf'))
  }

  const analyzeResumes = async () => {
    if (!jdFile || resumeFiles.length === 0) return
    
    setProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockRanking = resumeFiles.map((file, i) => ({
      resumeName: file.name,
      candidateName: `Candidate ${i + 1}`,
      email: `candidate${i + 1}@email.com`,
      similarity: Math.floor(Math.random() * 30) + 70,
      emailSent: false
    })).sort((a, b) => b.similarity - a.similarity)
    
    setRanking(mockRanking)
    setProcessing(false)
  }

   const sendEmails = () => {
    const updated = ranking.map((r, i) => 
      i < 3 ? { ...r, emailSent: true } : r
    )
    setRanking(updated)
    
    // Add notification
    const newNotification = {
      id: notifications.length + 1,
      message: 'Emails sent to top 3 candidates',
      time: 'Just now'
    }
  }

  const handleApplicationAction = (applicationId, action) => {
    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status: action } : app
    ))
    
    // Send notification to candidate
    const application = applications.find(app => app.id === applicationId)
    if (application) {
      // Simulate sending notification to candidate
      console.log(`Notification sent to ${application.name}: Application ${action}`)
    }
  }
 

  const exportCSV = () => {
    const csv = [
      ['Name', 'Email', 'Similarity %', 'Email Sent'],
      ...ranking.map(r => [r.candidateName, r.email, r.similarity, r.emailSent])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ranking.csv'
    a.click()
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recruiter Panel</h2>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center px-6 py-3 text-blue-600 bg-blue-50 dark:bg-blue-900/20">
            <Users className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <FileText className="w-5 h-5 mr-3" />
            Job Descriptions
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Mail className="w-5 h-5 mr-3" />
            Communications
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
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
                    <a href="#" className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </a>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Candidates</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{ranking.length}</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">JD Uploaded</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{jdFile ? 1 : 0}</div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Mail className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Emails Sent</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {ranking.filter(r => r.emailSent).length}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Upload className="w-8 h-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Resumes</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{resumeFiles.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upload Documents</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Job Description (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleJDUpload}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  {jdFile && <p className="text-sm text-green-600 mt-1">✓ {jdFile.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resumes (PDF)
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleResumeUpload}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                  {resumeFiles.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">✓ {resumeFiles.length} files selected</p>
                  )}
                </div>
                <button
                  onClick={analyzeResumes}
                  disabled={!jdFile || resumeFiles.length === 0 || processing}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  {processing ? 'Analyzing...' : 'Analyze Resumes'}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={sendEmails}
                  disabled={ranking.length === 0}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Emails to Top 3
                </button>
                <button
                  onClick={exportCSV}
                  disabled={ranking.length === 0}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Applications</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Role</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Score</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Status</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{app.name}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{app.role}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          app.score >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          app.score >= 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {app.score}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {app.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApplicationAction(app.id, 'accepted')}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleApplicationAction(app.id, 'rejected')}
                              className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rankings Table */}
          {ranking.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume Analysis Rankings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Rank</th>
                      <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Name</th>
                      <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Email</th>
                      <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Similarity</th>
                      <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Email Sent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {ranking.map((candidate, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{index + 1}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{candidate.candidateName}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{candidate.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            candidate.similarity >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            candidate.similarity >= 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {candidate.similarity}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {candidate.emailSent ? (
                            <span className="text-green-600 dark:text-green-400">✓ Sent</span>
                          ) : (
                            <span className="text-gray-400">Pending</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default RecruiterDashboard
 