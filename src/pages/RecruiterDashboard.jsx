import       { useState, useEffect } from 'react' 
import  { Users, FileText, BarChart3, Upload, MessageCircle, Settings, Trash, Eye, Download, Share, CheckCircle, Zap, Mail, Activity, Star, ChevronRight, ArrowLeft } from 'lucide-react'  
import Layout from '../components/Layout'
import MessagingSystem from '../components/MessagingSystem'
import ActivitySection from '../components/ActivitySection'
import  { useAuth } from '../context/AuthContext'
import { trackFileUpload, trackAnalysis, trackRanking, trackEmailSent, trackExport } from '../services/activityService' 
import { generateAIRanking } from '../services/aiRankingService'
import { generateRankingCSV, downloadCSV } from '../services/emailService'
import { jobDescriptions as jobDescriptionsData } from '../data/jobDescriptions'     

const     RecruiterDashboard = () => {
   const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
   const [previousTab, setPreviousTab] = useState('overview')
  const [navigationHistory, setNavigationHistory] = useState(['overview']) 
  const [jdFile, setJdFile] = useState(null)
  const [resumeFiles, setResumeFiles] = useState([])
  const [analysisResults, setAnalysisResults] = useState(null)
   const [candidateApplications, setCandidateApplications] = useState([])
  const [resumeRankings, setResumeRankings] = useState([])
  const [aiRankings, setAiRankings] = useState(null)
  const [isGeneratingRankings, setIsGeneratingRankings] = useState(false)
  const [savedCandidates, setSavedCandidates] = useState(() => {
    return JSON.parse(localStorage.getItem(`savedCandidates_${user?.email}`) || '[]')
  })
  const [selectedJobDetail, setSelectedJobDetail] = useState(null)
  const [candidateNames] = useState(['Gokul', 'Govarthanan', 'Kovarthini', 'Harini', 'Kabirhayan', 'Pavan Kumar', 'Prathyush', 'Dhana'])
  const [candidateEmails] = useState(['gokul.reply@gmail.com', 'govarthanan@gmail.com', 'kabirhayan14@gmail.com', 'kovarthini10@gmail.com'])   

  useEffect(() => {
    const applications = JSON.parse(localStorage.getItem('candidateApplications') || '[]')
    setCandidateApplications(applications)
    
    const rankings = JSON.parse(localStorage.getItem('resumeRankings') || '[]')
    setResumeRankings(rankings)
    
    const handleTabNavigation = (e) => {
      setActiveTab(e.detail)
    }
    
    // Listen for new job applications
    const handleNewJobApplication = (e) => {
      const newApplication = {
        id: Date.now(),
        candidateName: getRandomCandidateName(),
        candidateEmail: getRandomCandidateEmail(),
        jobRole: e.detail.jobTitle,
        score: Math.floor(Math.random() * 40) + 60,
        timestamp: Date.now(),
        resume: new Blob(['Mock resume content'], { type: 'application/pdf' })
      }
      
      const updatedApplications = [newApplication, ...candidateApplications]
      setCandidateApplications(updatedApplications)
      localStorage.setItem('candidateApplications', JSON.stringify(updatedApplications))
    }
    
    window.addEventListener('navigate-to-tab', handleTabNavigation)
    window.addEventListener('new-job-application', handleNewJobApplication)
    
    return () => {
      window.removeEventListener('navigate-to-tab', handleTabNavigation)
      window.removeEventListener('new-job-application', handleNewJobApplication)
    }
  }, [candidateApplications]) 

   const updateResumeScore = (applicationId, score) => {
    const updatedRankings = resumeRankings.map(ranking => 
      ranking.id === applicationId ? { ...ranking, score } : ranking
    )
    
    const newRanking = candidateApplications.find(app => app.id === applicationId && !resumeRankings.find(r => r.id === applicationId))
    if (newRanking) {
      updatedRankings.push({ ...newRanking, score })
    }
    
    setResumeRankings(updatedRankings)
    localStorage.setItem('resumeRankings', JSON.stringify(updatedRankings))
  }

  const deleteCandidate = (candidateId) => {
    const updatedApplications = candidateApplications.filter(app => app.id !== candidateId)
    setCandidateApplications(updatedApplications)
    localStorage.setItem('candidateApplications', JSON.stringify(updatedApplications))
    
    const updatedRankings = resumeRankings.filter(ranking => ranking.id !== candidateId)
    setResumeRankings(updatedRankings)
    localStorage.setItem('resumeRankings', JSON.stringify(updatedRankings))
  } 

  const generateAIRankings = async () => {
    if (candidateApplications.length === 0) return
    
    setIsGeneratingRankings(true)
    try {
      const rankings = await generateAIRanking(jdFile?.name || 'Job Position', candidateApplications)
      setAiRankings(rankings)
      
      // Update rankings with email sent status
      const rankedCandidates = rankings.rankings.map(candidate => ({
        ...candidate,
        id: candidateApplications.find(app => app.candidateEmail === candidate.candidateEmail)?.id || Date.now(),
        emailSent: false
      }))
      
      setResumeRankings(rankedCandidates)
      localStorage.setItem('aiRankings', JSON.stringify(rankings))
      setActiveTab('ai-ranking')
    } catch (error) {
      console.error('Error generating AI rankings:', error)
    }
    setIsGeneratingRankings(false)
  }

  const exportRankingsToCSV = () => {
    const dataToExport = aiRankings?.rankings || resumeRankings
    if (dataToExport.length === 0) return

    const csvContent = generateRankingCSV(dataToExport)
    downloadCSV(csvContent, 'ai_candidate_rankings.csv')

    // Notify requestor
    const notification = {
      id: Date.now(),
      message: `AI-generated ranking table received from ${user.name}`,
      recruiterName: user.name,
      recruiterId: user.specialId,
      timestamp: new Date().toISOString(),
      csvData: dataToExport,
      aiSummary: aiRankings?.summary || 'AI ranking analysis completed'
    }
    
    const existingNotifications = JSON.parse(localStorage.getItem('requestorNotifications') || '[]')
    existingNotifications.push(notification)
    localStorage.setItem('requestorNotifications', JSON.stringify(existingNotifications))
  }  

  const handleTabChange = (newTab) => {
    setPreviousTab(activeTab)
    setActiveTab(newTab)
  }

  const handleBackClick = () => {
    setActiveTab(previousTab)
  }

  const toggleSaveCandidate = (candidateId) => {
    const updatedSaved = savedCandidates.includes(candidateId)
      ? savedCandidates.filter(id => id !== candidateId)
      : [...savedCandidates, candidateId]
    
    setSavedCandidates(updatedSaved)
    localStorage.setItem(`savedCandidates_${user?.email}`, JSON.stringify(updatedSaved))
    
    // Track activity
    const candidate = candidateApplications.find(app => app.id === candidateId)
       if (candidate) {
      const action = savedCandidates.includes(candidateId) ? 'Unsaved' : 'Saved'
      
      // Add to saved items in activity section
      const savedItems = JSON.parse(localStorage.getItem(`savedItems_${user?.email}`) || '[]')
      if (!savedCandidates.includes(candidateId)) {
        const newSavedItem = {
          id: candidateId,
          title: `${candidate.candidateName}'s Application`,
          type: 'Candidate Application',
          saved: 'Just now'
        }
        savedItems.unshift(newSavedItem)
        localStorage.setItem(`savedItems_${user?.email}`, JSON.stringify(savedItems))
      } else {
        const updatedSavedItems = savedItems.filter(item => item.id !== candidateId)
        localStorage.setItem(`savedItems_${user?.email}`, JSON.stringify(updatedSavedItems))
      }
      
      window.dispatchEvent(new CustomEvent('newActivity', {
        detail: {
          action: `${action} ${candidate.candidateName}'s profile`,
          user: user.name,
          type: 'save',
          time: 'Just now'
        }
      }))
    } 
  }

   const sidebarItems = [
    { name: 'Overview', icon: BarChart3, active: activeTab === 'overview', onClick: () => handleTabChange('overview') },
    { name: 'Upload Files', icon: Upload, active: activeTab === 'upload', onClick: () => handleTabChange('upload') },
    { name: 'Applications', icon: Users, active: activeTab === 'applications', onClick: () => handleTabChange('applications') },
    { name: 'AI Ranking', icon: Zap, active: activeTab === 'ai-ranking', onClick: () => handleTabChange('ai-ranking') },
    { name: 'Resume Ranking', icon: BarChart3, active: activeTab === 'ranking', onClick: () => handleTabChange('ranking') },
    { name: 'Job Descriptions', icon: FileText, active: activeTab === 'jobs', onClick: () => handleTabChange('jobs') },
    { name: 'Candidates', icon: Users, active: activeTab === 'candidates', onClick: () => handleTabChange('candidates') },
    { name: 'Analysis', icon: BarChart3, active: activeTab === 'analysis', onClick: () => handleTabChange('analysis') },
    { name: 'Messages', icon: MessageCircle, active: activeTab === 'messages', onClick: () => handleTabChange('messages') },
    { name: 'Activity', icon: Activity, active: activeTab === 'activity', onClick: () => handleTabChange('activity') }
  ] 

  const stats = [
    { label: 'Total Candidates', value: '234', change: '+12%', color: 'blue' },
    { label: 'Active JDs', value: '15', change: '+3%', color: 'green' },
    { label: 'Interviews Scheduled', value: '28', change: '+8%', color: 'purple' },
    { label: 'Positions Filled', value: '7', change: '+2%', color: 'orange' }
  ]

   const candidates = [
    { name: 'Sarah Johnson', role: 'Frontend Developer', score: 94, status: 'Interview', appliedJd: 'Senior Frontend Developer' },
    { name: 'Michael Chen', role: 'Backend Developer', score: 89, status: 'Review', appliedJd: 'Backend Developer' },
    { name: 'Emma Davis', role: 'UI Designer', score: 92, status: 'Hired', appliedJd: 'UI/UX Designer' },
    { name: 'James Wilson', role: 'DevOps Engineer', score: 87, status: 'Test', appliedJd: 'DevOps Engineer' }
  ]

   const jobDescriptions = [
    { id: 1, title: 'Senior Frontend Developer', department: 'Engineering', posted: '2024-01-15' },
    { id: 2, title: 'Backend Developer', department: 'Engineering', posted: '2024-01-12' },
    { id: 3, title: 'UI/UX Designer', department: 'Design', posted: '2024-01-10' },
    { id: 4, title: 'DevOps Engineer', department: 'Operations', posted: '2024-01-08' }
  ]

  const getRandomCandidateName = () => {
    return candidateNames[Math.floor(Math.random() * candidateNames.length)]
  }

  const getRandomCandidateEmail = () => {
    return candidateEmails[Math.floor(Math.random() * candidateEmails.length)]
  } 

  const handleJdUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type === 'application/pdf') {
      setJdFile(file)
    }
  }

   const handleResumeUpload = (e) => {
    const files = Array.from(e.target.files)
    const pdfFiles = files.filter(file => file.type === 'application/pdf')
    setResumeFiles(prev => [...prev, ...pdfFiles])
    pdfFiles.forEach(file => trackFileUpload(file.name, 'Resume', user.name))
  } 

  const analyzeResumes = () => {
    if (!jdFile || resumeFiles.length === 0) return
    
    const mockResults = resumeFiles.map((file, index) => ({
      fileName: file.name,
      candidateName: `Candidate ${index + 1}`,
      score: Math.floor(Math.random() * 40) + 60,
      email: `candidate${index + 1}@example.com`,
      matchedSkills: ['JavaScript', 'React', 'Node.js'].slice(0, Math.floor(Math.random() * 3) + 1)
    })).sort((a, b) => b.score - a.score)

    setAnalysisResults(mockResults)
    localStorage.setItem('analysisResults', JSON.stringify(mockResults))
    setActiveTab('analysis')
  } 

   const JobDescriptionsSection = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Job Descriptions</h3>
        <div className="grid gap-4">
          {Object.entries(jobDescriptionsData).map(([key, job]) => (
            <div key={key} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{job.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{job.department} • {job.location}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">{job.experience}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{job.description}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJobDetail(job)
                    setActiveTab('job-detail')
                  }}
                  className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center space-x-1"
                >
                  <span>Show More</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {job.skills?.slice(0, 3).map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                    {skill}
                  </span>
                ))}
                {job.skills?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const JobDetailView = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setActiveTab('jobs')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Jobs</span>
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedJobDetail?.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span>📍 {selectedJobDetail?.location}</span>
              <span>🏢 {selectedJobDetail?.department}</span>
              <span>⏰ {selectedJobDetail?.type}</span>
              <span>📈 {selectedJobDetail?.experience}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Job Description</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedJobDetail?.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Requirements</h3>
            <ul className="space-y-2">
              {selectedJobDetail?.requirements?.map((req, index) => (
                <li key={index} className="flex items-start space-x-2 text-gray-700 dark:text-gray-300">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {selectedJobDetail?.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Additional Information</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>Minimum Academic Percentage: {selectedJobDetail?.minPercentage}%</p>
              <p>Experience Level: {selectedJobDetail?.experienceLevel}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => { 
    switch(activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
                       <div className="responsive-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"> 
                           {stats.map((stat, index) => (
                <div key={index} className="card p-6 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}> 
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`text-${stat.color}-600 text-sm font-medium`}>
                      {stat.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
                       <div className="responsive-grid grid-cols-1 lg:grid-cols-2"> 
                         <div className="card p-6 animate-slide-in"> 
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">New Applications</h3>
                  {candidateApplications.length > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {candidateApplications.length} new
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {candidateApplications.slice(0, 3).map((application) => (
                    <div key={application.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-medium text-blue-700 dark:text-blue-300">{application.candidateName}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400">{application.jobRole}</p>
                      <p className="text-xs text-blue-500">Applied {new Date(application.timestamp).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {candidateApplications.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No new applications</p>
                  )}
                </div>
              </div>
                           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                                 <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="w-full flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">Upload Files</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('applications')}
                    className="w-full flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                  >
                    <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-green-700 dark:text-green-300">Review Applications</span>
                  </button>
                  <button 
                    onClick={generateAIRankings}
                    disabled={candidateApplications.length === 0 || isGeneratingRankings}
                    className="w-full flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors disabled:opacity-50"
                  >
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-purple-700 dark:text-purple-300">
                      {isGeneratingRankings ? 'Generating...' : 'Rank Resumes'}
                    </span>
                  </button>
                </div> 
              </div> 
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Top Candidates</h3>
                <div className="space-y-3">
                  {candidates.slice(0, 3).map((candidate, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{candidate.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{candidate.score}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{candidate.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
           case 'upload':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Job Description</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleJdUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                />
                {jdFile && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                    ✓ {jdFile.name} uploaded
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload Resumes</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleResumeUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
                />
                {resumeFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Uploaded files ({resumeFiles.length}):
                    </p>
                    {resumeFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{file.name}</span>
                        <button
                          onClick={() => setResumeFiles(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {jdFile && resumeFiles.length > 0 && (
                             <button
                  onClick={analyzeResumes}
                  className="btn-primary w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                > 
                Analyze Resumes
              </button>
                       )}
          </div>
        )
      case 'applications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Candidate Applications</h3>
              {candidateApplications.length > 0 ? (
                <div className="space-y-4">
                  {candidateApplications.map((application) => (
                    <div key={application.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                                               <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{application.candidateName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{application.candidateEmail}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400">{application.jobRole}</p>
                          {application.skillsMatch && (
                            <p className="text-xs text-gray-500 dark:text-gray-500">Skills Match: {application.skillsMatch}%</p>
                          )}
                        </div>
                        <div className="text-right space-y-1">
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            application.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            application.score >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {application.score}%
                          </span>
                          {application.analysis?.isEligible && (
                            <div className="flex items-center text-green-600 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              <span className="text-xs">Eligible</span>
                            </div>
                          )}
                        </div> 
                      </div>
                                           <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            const url = URL.createObjectURL(application.resume)
                            window.open(url, '_blank')
                          }}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                        <button 
                          onClick={() => {
                            const url = URL.createObjectURL(application.resume)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${application.candidateName}_resume.pdf`
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                          className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={(e) => {
                            const sharedResume = {
                              id: application.id,
                              candidateName: application.candidateName,
                              candidateEmail: application.candidateEmail,
                              jobRole: application.jobRole,
                              resume: application.resume,
                              score: application.score,
                              skillsMatch: application.skillsMatch,
                              analysis: application.analysis,
                              sharedBy: user.name,
                              sharedById: user.specialId,
                              sharedAt: new Date().toISOString()
                            }
                            
                            const existingShared = JSON.parse(localStorage.getItem('sharedResumes') || '[]')
                            const updatedShared = existingShared.filter(r => r.id !== application.id)
                            updatedShared.push(sharedResume)
                            localStorage.setItem('sharedResumes', JSON.stringify(updatedShared))
                            
                            const button = e.target.closest('button')
                            const originalText = button.innerHTML
                            button.innerHTML = '<span class="flex items-center space-x-1"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg><span>Shared</span></span>'
                            button.style.backgroundColor = '#10b981'
                            setTimeout(() => {
                              button.innerHTML = originalText
                              button.style.backgroundColor = ''
                            }, 2000)
                          }}
                          className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center space-x-1"
                        >
                          <Share className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                        <button
                          onClick={() => deleteCandidate(application.id)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm flex items-center space-x-1"
                        >
                          <Trash className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                        <button
                          onClick={() => toggleSaveCandidate(application.id)}
                          className={`px-3 py-2 rounded hover:opacity-80 text-sm flex items-center space-x-1 transition-all ${
                            savedCandidates.includes(application.id) 
                              ? 'bg-yellow-600 text-white' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <Star className="w-4 h-4" />
                          <span>{savedCandidates.includes(application.id) ? 'Saved' : 'Save'}</span>
                        </button>
                      </div> 
                                           <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Applied on {new Date(application.timestamp || Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p> 
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No applications received yet.</p>
              )}
            </div>
                   </div>
        )
      case 'ai-ranking':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI-Generated Candidate Rankings</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={generateAIRankings}
                    disabled={candidateApplications.length === 0 || isGeneratingRankings}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>{isGeneratingRankings ? 'Generating...' : 'Generate Rankings'}</span>
                  </button>
                  {aiRankings && (
                    <button
                      onClick={exportRankingsToCSV}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                  )}
                </div>
              </div>
              
              {aiRankings ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">AI Analysis Summary</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{aiRankings.summary}</p>
                  </div>
                  
                                 <div className="overflow-x-auto table-responsive">
                  <table className="w-full min-w-[600px]"> 
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Rank</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">AI Score</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Recommendation</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Action</th> 
                        </tr>
                      </thead>
                      <tbody>
                                               {aiRankings.rankings.map((candidate, index) => (
                          <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">#{candidate.rank}</td>
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{candidate.candidateName}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{candidate.candidateEmail}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-sm rounded ${
                                candidate.aiScore >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                candidate.aiScore >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {candidate.aiScore}%
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                candidate.recommendation === 'Strong' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                candidate.recommendation === 'Moderate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {candidate.recommendation}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-sm">
                              {candidate.emailSent ? 'Mail Sent' : 'Pending'}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => deleteCandidate(candidate.id)}
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
                  
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Top Recommendations</h4>
                    <div className="space-y-2">
                      {aiRankings.topRecommendations.slice(0, 3).map((email, index) => {
                        const candidate = aiRankings.rankings.find(c => c.candidateEmail === email)
                        return (
                          <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded">
                            <span className="text-sm text-gray-900 dark:text-white">{candidate?.candidateName}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{candidate?.aiScore}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Click "Generate Rankings" to get AI-powered candidate analysis</p>
                </div>
              )}
            </div>
          </div>
        )
      case 'ranking': 
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Resume Ranking</h3>
                {resumeRankings.length > 0 && (
                                   <button
                    onClick={exportRankingsToCSV}
                    data-export-btn
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-all duration-300 transform hover:scale-105"
                  >
                    Export to CSV
                  </button> 
                )}
              </div>
              
              {candidateApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Candidate Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Job Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Initial Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Your Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidateApplications.map((application) => {
                        const ranking = resumeRankings.find(r => r.id === application.id)
                        return (
                          <tr key={application.id} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{application.candidateName}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{application.jobRole}</td>
                            <td className="py-3 px-4 text-gray-900 dark:text-white">{application.score}%</td>
                            <td className="py-3 px-4">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={ranking?.score || ''}
                                onChange={(e) => updateResumeScore(application.id, parseInt(e.target.value))}
                                placeholder="Score"
                                className="w-20 p-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white text-center"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <button 
                                onClick={() => {
                                  const url = URL.createObjectURL(application.resume)
                                  window.open(url, '_blank')
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                View Resume
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No applications to rank yet.</p>
              )}
            </div>
          </div>
        )
           case 'jobs': 
        return <JobDescriptionsSection />
        
      case 'job-detail':
        return <JobDetailView /> 
      case 'candidates':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Candidate Applications</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Applied JD</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Score</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidates.map((candidate, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{candidate.name}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{candidate.appliedJd}</td>
                          <td className="py-3 px-4 text-gray-900 dark:text-white">{candidate.score}%</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              candidate.status === 'Hired' ? 'bg-green-100 text-green-800' :
                              candidate.status === 'Interview' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {candidate.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )
      case 'analysis':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resume Analysis Results</h3>
              {analysisResults ? (
                <div className="space-y-4">
                  {analysisResults.map((result, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{result.candidateName}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{result.email}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                          {result.score}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">File: {result.fileName}</p>
                      <div className="mt-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Skills: {result.matchedSkills.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No analysis results yet. Please upload JD and resumes first.</p>
              )}
            </div>
          </div>
        )
           case 'messages':
        return (
          <div className="space-y-6">
            <MessagingSystem user={user} />
          </div>
        )
      case 'activity':
        return <ActivitySection userRole="recruiter" />
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
      showBackButton={activeTab !== 'overview'} 
      onBackClick={handleBackClick}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
        </div>
        {renderContent()}
      </div>
    </Layout>
  ) 
}

export default RecruiterDashboard
 