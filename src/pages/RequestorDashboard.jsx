import     { useState, useEffect } from 'react'
import  { Activity, CheckCircle, Clock, BarChart3, MessageCircle, Settings, FileText, Eye, Download, Mail, X, Trash, Star } from 'lucide-react'   
import  Layout from '../components/Layout'
import MessagingSystem from '../components/MessagingSystem'
import ActivitySection from '../components/ActivitySection'
import { useAuth } from '../context/AuthContext'
import { sendSelectionEmails } from '../services/emailService'   

const     RequestorDashboard = () => {
  const [activeTab, setActiveTab] = useState('workflow')
   const [previousTab, setPreviousTab] = useState('workflow')
  const [navigationHistory, setNavigationHistory] = useState(['workflow']) 
  const [analysisResults, setAnalysisResults] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [sharedRankings, setSharedRankings] = useState([])
  const [sharedResumes, setSharedResumes] = useState([])
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [emailStatus, setEmailStatus] = useState(null)
  const [isSendingEmails, setIsSendingEmails] = useState(false)
  const { user } = useAuth()  

  useEffect(() => {
    const savedResults = localStorage.getItem('analysisResults')
    if (savedResults) {
      setAnalysisResults(JSON.parse(savedResults))
    }
    
    const requestorNotifications = JSON.parse(localStorage.getItem('requestorNotifications') || '[]')
    setNotifications(requestorNotifications)
    
    const rankings = requestorNotifications.flatMap(n => n.csvData || [])
    setSharedRankings(rankings)
    
    const sharedResumesData = JSON.parse(localStorage.getItem('sharedResumes') || '[]')
    setSharedResumes(sharedResumesData)
    
    // Auto-select top 3 candidates based on scores
    if (rankings.length > 0) {
      const top3 = rankings
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 3)
        .map(c => c.id || c.candidateEmail)
      setSelectedCandidates(top3)
    }
  }, [])  

  const handleTabChange = (newTab) => {
    setPreviousTab(activeTab)
    setActiveTab(newTab)
  }

  const handleBackClick = () => {
    setActiveTab(previousTab)
  }

   const sidebarItems = [
    { name: 'Workflow Status', icon: Activity, active: activeTab === 'workflow', onClick: () => handleTabChange('workflow') },
    { name: 'Ranking Tables', icon: BarChart3, active: activeTab === 'rankings', onClick: () => handleTabChange('rankings') },
    { name: 'Shared Resumes', icon: FileText, active: activeTab === 'shared-resumes', onClick: () => handleTabChange('shared-resumes') },
    { name: 'Resume Analysis', icon: BarChart3, active: activeTab === 'analysis', onClick: () => handleTabChange('analysis') },
    { name: 'Communication', icon: MessageCircle, active: activeTab === 'communication', onClick: () => handleTabChange('communication') },
    { name: 'Activity Center', icon: Settings, active: activeTab === 'activity', onClick: () => handleTabChange('activity') }
  ] 

    const sendEmailsToCandidates = async () => {
    if (sharedRankings.length === 0) return
    
    setIsSendingEmails(true)
    setEmailStatus(null)
    
    try {
      const result = await sendSelectionEmails(sharedRankings, selectedCandidates)
      setEmailStatus(result)
      
      // Update rankings to mark emails as sent
      const updatedRankings = sharedRankings.map(candidate => ({
        ...candidate,
        emailSent: true
      }))
      setSharedRankings(updatedRankings)
      
      // Update localStorage
      const existingNotifications = JSON.parse(localStorage.getItem('requestorNotifications') || '[]')
      const updatedNotifications = existingNotifications.map(notification => ({
        ...notification,
        csvData: notification.csvData?.map(candidate => ({
          ...candidate,
          emailSent: true
        }))
      }))
      localStorage.setItem('requestorNotifications', JSON.stringify(updatedNotifications))
      
    } catch (error) {
      setEmailStatus({
        success: false,
        message: 'Failed to send emails. Please try again.'
      })
    }
    
    setIsSendingEmails(false)
  }

  const deleteCandidate = (candidateId) => {
    const updatedRankings = sharedRankings.filter(ranking => 
      (ranking.id || ranking.candidateEmail) !== candidateId
    )
    setSharedRankings(updatedRankings)
    
    // Update localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('requestorNotifications') || '[]')
    const updatedNotifications = existingNotifications.map(notification => ({
      ...notification,
      csvData: notification.csvData?.filter(candidate => 
        (candidate.id || candidate.candidateEmail) !== candidateId
      )
    }))
    localStorage.setItem('requestorNotifications', JSON.stringify(updatedNotifications))
  } 

  const workflowSteps = [
    { name: 'JD Uploaded', completed: true, timestamp: '2024-01-15 09:00 AM', icon: CheckCircle },
    { name: 'Resumes Analyzed', completed: true, timestamp: '2024-01-15 10:30 AM', icon: CheckCircle },
    { name: 'Candidates Ranked', completed: true, timestamp: '2024-01-15 11:15 AM', icon: CheckCircle },
    { name: 'Emails Sent', completed: emailStatus?.success || false, timestamp: emailStatus?.success ? new Date().toLocaleString() : null, icon: emailStatus?.success ? CheckCircle : Clock }
  ] 

  const topMatches = [
    { name: 'Alex Thompson', email: 'alex@example.com', score: 94, reason: 'Perfect skill match with 5+ years experience' },
    { name: 'Maria Rodriguez', email: 'maria@example.com', score: 91, reason: 'Strong technical background and leadership skills' },
    { name: 'David Kim', email: 'david@example.com', score: 88, reason: 'Excellent problem-solving abilities and team fit' }
  ]

  const renderContent = () => {
    switch(activeTab) {
      case 'workflow':
        return (
          <div className="space-y-6">
                       <div className="card p-6 animate-fade-in"> 
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Workflow Progress</h3>
              <div className="space-y-6">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      <step.icon className={`w-5 h-5 ${
                        step.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {step.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {step.timestamp || 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

                       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                {notifications.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {notifications.length} new
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="font-medium text-blue-700 dark:text-blue-300">{notification.message}</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">From: {notification.recruiterName} ({notification.recruiterId})</p>
                    <p className="text-xs text-blue-500">{new Date(notification.timestamp).toLocaleDateString()}</p>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No new notifications</p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top 3 Matches</h3>
              <div className="space-y-4">
                {topMatches.map((match, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{match.name}</h4>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full">
                        {match.score}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{match.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{match.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) 
           case 'analysis':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resume Analysis Summary</h3>
                           <div className="responsive-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-6"> 
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {analysisResults ? analysisResults.length : 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Resumes</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {analysisResults ? analysisResults.filter(r => r.score >= 80).length : 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">High Matches</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {analysisResults ? Math.min(3, analysisResults.filter(r => r.score >= 85).length) : 0}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Interview Ready</p>
                </div>
              </div>

              {analysisResults && (
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Analysis Results</h4>
                  {analysisResults.map((result, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">{result.candidateName}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{result.email}</p>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          result.score >= 85 ? 'bg-green-100 text-green-800' :
                          result.score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.score}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Skills: {result.matchedSkills.join(', ')}</p>
                    </div>
                  ))}
                </div>
                           )}
            </div>
          </div>
        )
      case 'rankings':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shared Resume Rankings</h3>
              
              {sharedRankings.length > 0 ? (
                               <div className="overflow-x-auto table-responsive">
                  <table className="w-full min-w-[800px]"> 
                                       <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                          <input
                            type="checkbox"
                            checked={selectedCandidates.length === sharedRankings.length && sharedRankings.length > 0}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCandidates(sharedRankings.map(r => r.id || r.candidateEmail))
                              } else {
                                setSelectedCandidates([])
                              }
                            }}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                        </th>
                                               <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Candidate Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Job Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Initial Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Recruiter Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date Applied</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Action</th> 
                      </tr>
                    </thead> 
                    <tbody>
                      {sharedRankings
                        .sort((a, b) => (b.score || 0) - (a.score || 0))
                        .map((ranking, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selectedCandidates.includes(ranking.id || ranking.candidateEmail)}
                              onChange={(e) => {
                                const candidateId = ranking.id || ranking.candidateEmail
                                if (e.target.checked) {
                                  setSelectedCandidates([...selectedCandidates, candidateId])
                                } else {
                                  setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId))
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{ranking.candidateName}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{ranking.candidateEmail}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{ranking.jobRole}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded">
                              {ranking.score}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">
                            {ranking.score ? (
                              <span className={`px-2 py-1 text-sm rounded ${
                                ranking.score >= 80 ? 'bg-green-100 text-green-800' :
                                ranking.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {ranking.score}%
                              </span>
                            ) : (
                              <span className="text-gray-400">Not scored</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                            {ranking.emailSent ? (
                              <span className="text-green-600 dark:text-green-400 flex items-center">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Sent
                              </span>
                            ) : (
                              <span className="text-gray-400">Pending</span>
                            )}
                          </td>
                                                   <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                            {new Date(ranking.timestamp || ranking.uploadDate || Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => deleteCandidate(ranking.id || ranking.candidateEmail)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </td> 
                        </tr> 
                      ))}
                    </tbody>
                  </table>
                </div>
                           ) : (
                <p className="text-gray-500 dark:text-gray-400">No ranking tables received yet.</p>
              )}
              
              {sharedRankings.length > 0 && (
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedCandidates.length} of {sharedRankings.length} candidates selected
                    </div>
                    <button
                      onClick={sendEmailsToCandidates}
                      disabled={selectedCandidates.length === 0 || isSendingEmails}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{isSendingEmails ? 'Sending...' : 'Send Mail to Candidates'}</span>
                    </button>
                  </div>
                  
                  {emailStatus && (
                    <div className={`p-4 rounded-lg ${
                      emailStatus.success 
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {emailStatus.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <X className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                        <p className={`font-medium ${
                          emailStatus.success 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-red-800 dark:text-red-200'
                        }`}>
                          {emailStatus.success ? 'Email sent to candidates' : 'Email sending failed'}
                        </p>
                      </div>
                      <p className={`text-sm mt-1 ${
                        emailStatus.success 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-red-700 dark:text-red-300'
                      }`}>
                        {emailStatus.message}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div> 

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Ranking Summary</h3>
                           <div className="responsive-grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3"> 
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sharedRankings.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Candidates</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {sharedRankings.filter(r => r.score && r.score >= 80).length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">High Scorers (≥80%)</p>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {sharedRankings.filter(r => r.score).length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ranked Candidates</p>
                </div>
              </div>
            </div>
          </div>
        )
           case 'shared-resumes':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">View Shared Resume by Recruiter</h3>
              
              {sharedResumes.length > 0 ? (
                <div className="space-y-4">
                  {sharedResumes.map((resume) => (
                    <div key={resume.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{resume.candidateName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{resume.candidateEmail}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">{resume.jobRole}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Shared by: {resume.sharedBy} ({resume.sharedById})
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Shared on: {new Date(resume.sharedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                                                                      <button 
                          onClick={() => {
                            const url = URL.createObjectURL(resume.resume)
                            window.open(url, '_blank')
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={(e) => {
                            // Save resume
                            const savedItem = {
                              id: Date.now(),
                              title: `${resume.candidateName} - Resume`,
                              type: 'Resume',
                              saved: 'Just now',
                              resumeId: resume.id
                            }
                            
                            const existingSaved = JSON.parse(localStorage.getItem(`savedItems_${user.email}`) || '[]')
                            existingSaved.unshift(savedItem)
                            localStorage.setItem(`savedItems_${user.email}`, JSON.stringify(existingSaved))
                            
                            // Track save activity
                            window.dispatchEvent(new CustomEvent('newActivity', {
                              detail: {
                                action: `Saved ${resume.candidateName}'s resume`,
                                user: user.name,
                                type: 'save',
                                time: 'Just now'
                              }
                            }))
                            
                            const button = e.target.closest('button')
                            const originalText = button.innerHTML
                            button.innerHTML = '<span class="flex items-center space-x-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v14l7-3 7 3V5a2 2 0 00-2-2H5z"/></svg><span>Saved</span></span>'
                            button.style.backgroundColor = '#059669'
                            setTimeout(() => {
                              button.innerHTML = originalText
                              button.style.backgroundColor = ''
                            }, 2000)
                          }}
                          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center space-x-1"
                        >
                          <Star className="w-4 h-4" />
                          <span>Save</span>
                        </button> 
                        <button 
                          onClick={() => {
                            const url = URL.createObjectURL(resume.resume)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${resume.candidateName}_resume.pdf`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                        {resume.analysis && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            <p>Eligibility: {resume.score}%</p>
                            <p>Skills Match: {resume.skillsMatch}%</p>
                          </div>
                        )} 
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No resumes shared by recruiters yet.</p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Shared Resume Summary</h3>
                             <div className="responsive-grid grid-cols-1 md:grid-cols-2"> 
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{sharedResumes.length}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Shared Resumes</p>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {new Set(sharedResumes.map(r => r.sharedBy)).size}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unique Recruiters</p>
                </div>
              </div>
            </div>
          </div>
        )
      case 'communication': 
        return (
          <div className="space-y-6">
            <MessagingSystem user={user} />
          </div>
        )
      case 'activity':
        return <ActivitySection userRole="requestor" />
      default: 
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">Content for {activeTab} coming soon...</p>
          </div>
        )
    }
  }

   return (
    <Layout 
      sidebarItems={sidebarItems}
      showBackButton={activeTab !== 'workflow'} 
      onBackClick={handleBackClick}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AR Requestor Dashboard</h1>
        </div>
        {renderContent()}
      </div>
    </Layout>
  ) 
}

export default RequestorDashboard
 