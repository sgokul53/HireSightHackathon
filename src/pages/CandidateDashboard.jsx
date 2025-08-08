import  { useState, useEffect } from 'react'
import { Upload, User, BarChart3, FileText, Settings, Briefcase, CheckCircle, XCircle, Activity } from 'lucide-react'
import Layout from '../components/Layout'
import ActivitySection from '../components/ActivitySection'
import { jobDescriptions } from '../data/jobDescriptions'
import { analyzeResumeEligibility, extractTextFromPDF } from '../services/geminiService'   

const   CandidateDashboard = () => {
   const [activeTab, setActiveTab] = useState('jobs')
  const [navigationHistory, setNavigationHistory] = useState(['jobs']) 
  const [selectedRole, setSelectedRole] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [resumeFile, setResumeFile] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
   const [applied, setApplied] = useState(false)  

  useEffect(() => {
    const handleJobNavigation = (e) => {
      const job = e.detail
      setSelectedJob(job)
      setSelectedRole(job.key)
      setActiveTab('jobs')
      setResumeFile(null)
      setAnalysisResult(null)
    }
    
    window.addEventListener('navigate-to-job', handleJobNavigation)
    return () => window.removeEventListener('navigate-to-job', handleJobNavigation)
  }, [])

   const sidebarItems = [ 
    { name: 'Available Jobs', icon: Briefcase, active: activeTab === 'jobs', onClick: () => setActiveTab('jobs') },
    { name: 'Profile', icon: User, active: activeTab === 'profile', onClick: () => setActiveTab('profile') },
    { name: 'Applications', icon: FileText, active: activeTab === 'applications', onClick: () => setActiveTab('applications') },
    { name: 'Activity', icon: Activity, active: activeTab === 'activity', onClick: () => setActiveTab('activity') }
  ] 

  const jobRoles = [
    'Software Engineer',
    'Data Analyst',
    'Data Scientist',
    'Frontend Developer',
    'DevOps Engineer'
  ]

   const applications = [
    { id: 1, role: 'Software Engineer', company: 'TechCorp', status: 'under-review', date: '2024-01-15' },
    { id: 2, role: 'Frontend Developer', company: 'StartupXYZ', status: 'interview', date: '2024-01-10' },
    { id: 3, role: 'Data Scientist', company: 'DataTech', status: 'rejected', date: '2024-01-05' }
  ]

   const analyzeResume = async () => {
    if (!resumeFile || !selectedJob) return
    
    setAnalyzing(true)
    try {
      const resumeText = await extractTextFromPDF(resumeFile)
      const analysis = await analyzeResumeEligibility(resumeText, selectedJob)
      setAnalysisResult(analysis)
    } catch (error) {
      console.error('Analysis error:', error)
      setAnalysisResult({
        eligibilityScore: 70,
        skillsMatchPercentage: 65,
        isEligible: false,
        feedback: 'Analysis failed. Please try again.',
        strengths: [],
        improvements: []
      })
    }
    setAnalyzing(false)
  } 

  const applyForJob = () => {
    if (!resumeFile || !selectedJob || !analysisResult || !analysisResult.isEligible) return
    
    const application = {
      candidateName: 'John Candidate',
      candidateEmail: 'candidate@gmail.com',
      jobRole: selectedJob.title,
      jobId: selectedRole,
      resume: resumeFile,
      score: analysisResult.eligibilityScore,
      skillsMatch: analysisResult.skillsMatchPercentage,
      timestamp: new Date().toISOString(),
      uploadDate: new Date().toISOString(),
      id: Date.now(),
      analysis: analysisResult
    }
    
    const existingApplications = JSON.parse(localStorage.getItem('candidateApplications') || '[]')
    existingApplications.push(application)
    localStorage.setItem('candidateApplications', JSON.stringify(existingApplications))
    
    setApplied(true)
    setTimeout(() => setApplied(false), 3000)
  } 

   const renderContent = () => {
    switch(activeTab) {
      case 'jobs':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Available Job Roles</h3>
              <div className="grid gap-4">
                {Object.entries(jobDescriptions).map(([key, job]) => (
                  <div key={key} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{job.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{job.department} • {job.location}</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400">{job.experience} • {job.type}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedJob(job)
                          setSelectedRole(key)
                          setResumeFile(null)
                          setAnalysisResult(null)
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedJob && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedJob.title}</h3>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full">
                    {selectedJob.type}
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">{selectedJob.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">{req}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Upload Resume</h4>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {resumeFile ? resumeFile.name : 'Upload your resume (PDF format)'}
                    </p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResumeFile(e.target.files[0])}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </div>

                  {resumeFile && (
                    <button
                      onClick={analyzeResume}
                      disabled={analyzing}
                      className="w-full mt-4 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {analyzing ? 'Analyzing Eligibility...' : 'Check Eligibility'}
                    </button>
                  )}

                  {analysisResult && (
                    <div className="mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex items-center mb-4">
                        {analysisResult.isEligible ? (
                          <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500 mr-2" />
                        )}
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {analysisResult.isEligible ? 'Eligible to Apply' : 'Not Eligible'}
                        </h5>
                      </div>

                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"> 
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{analysisResult.eligibilityScore}%</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Eligibility Score</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">{analysisResult.skillsMatchPercentage}%</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Skills Match</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{analysisResult.feedback}</p>

                      {analysisResult.isEligible ? (
                        <button
                          onClick={applyForJob}
                          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Apply for Job
                        </button>
                      ) : (
                        <div className="w-full bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 py-3 px-4 rounded-lg text-center">
                          You can't apply for this job
                        </div>
                      )}

                      {applied && (
                        <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg">
                          <p className="text-green-800 dark:text-green-200 text-sm">
                            ✓ Application submitted successfully!
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      case 'profile': 
        return (
          <div className="space-y-6">
                       <div className="card p-6 animate-fade-in"> 
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Profile Overview</h3>
                           <div className="responsive-grid grid-cols-1 md:grid-cols-2"> 
                               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preferred Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select a role</option>
                    {Object.entries(jobDescriptions).map(([key, job]) => (
                      <option key={key} value={key}>{job.title}</option>
                    ))}
                  </select>
                </div> 
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior Level</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )
  
      case 'applications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Application History</h3>
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{app.role}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        app.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'under-review' ? 'bg-yellow-100 text-yellow-800' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.company}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Applied on {app.date}</p>
                  </div>
                ))}
                           </div>
            </div>
          </div>
        )
      case 'activity':
        return <ActivitySection userRole="candidate" />
      default: 
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 dark:text-gray-400">Content for {activeTab} coming soon...</p>
          </div>
        )
    }
  }

  return (
    <Layout sidebarItems={sidebarItems}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Candidate Dashboard</h1>
        </div>
        {renderContent()}
      </div>
    </Layout>
  )
}

export default CandidateDashboard
 