import  { useState } from 'react'
import { CheckCircle, Clock, Mail, Users, FileText, BarChart3 } from 'lucide-react'

const ARRequestorDashboard = () => {
  const [activeTab, setActiveTab] = useState('workflow')

  const workflowSteps = [
    { name: 'JD Uploaded', completed: true, timestamp: '2024-01-15 09:00 AM', icon: FileText },
    { name: 'Resumes Analyzed', completed: true, timestamp: '2024-01-15 10:30 AM', icon: BarChart3 },
    { name: 'Candidates Ranked', completed: true, timestamp: '2024-01-15 11:15 AM', icon: Users },
    { name: 'Emails Sent', completed: false, timestamp: null, icon: Mail }
  ]

  const topCandidates = [
    { name: 'John Smith', email: 'john@example.com', score: 94, reason: 'Excellent React and Node.js skills' },
    { name: 'Sarah Johnson', email: 'sarah@example.com', score: 87, reason: 'Strong Python background' },
    { name: 'Mike Brown', email: 'mike@example.com', score: 83, reason: 'Good Java experience' }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AR Requestor Dashboard</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab('workflow')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'workflow'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Workflow Status
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`py-2 px-4 border-b-2 font-medium text-sm ${
                activeTab === 'candidates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Top Matches
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'workflow' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recruitment Progress</h3>
              
              <div className="space-y-4">
                {workflowSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {step.name}
                        </h4>
                        {step.timestamp && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {step.timestamp}
                          </span>
                        )}
                      </div>
                      <div className={`mt-1 w-full h-2 rounded-full ${
                        step.completed ? 'bg-green-200' : 'bg-gray-200'
                      }`}>
                        <div className={`h-2 rounded-full ${
                          step.completed ? 'bg-green-600 w-full' : 'bg-gray-400 w-0'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Top 3 Candidate Matches</h3>
              
              <div className="grid gap-4">
                {topCandidates.map((candidate, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{candidate.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.email}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {candidate.score}% Match
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{candidate.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ARRequestorDashboard
 