import  { useState } from 'react'
import { CheckCircle, Clock, Mail, Users, Bell, ChevronDown, User, Settings, LogOut } from 'lucide-react'

const ARRequestorDashboard = ({ user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
   const [notifications] = useState([
    { id: 1, message: 'New project assigned', time: '1 hour ago' },
    { id: 2, message: 'Consultant request approved', time: '3 hours ago' },
    { id: 3, message: 'Workflow milestone completed', time: '5 hours ago' }
  ])
  const [consultants] = useState([
    { id: 1, name: 'Alice Johnson', expertise: 'Full Stack Development', availability: 'Available', rate: '$120/hr' },
    { id: 2, name: 'Bob Wilson', expertise: 'Data Science', availability: 'Busy', rate: '$150/hr' },
    { id: 3, name: 'Carol Davis', expertise: 'UI/UX Design', availability: 'Available', rate: '$100/hr' }
  ])
  const [projects] = useState([
    { id: 1, name: 'E-commerce Platform', consultant: 'Alice Johnson', status: 'In Progress', deadline: '2024-02-15' },
    { id: 2, name: 'Data Analytics Dashboard', consultant: 'Bob Wilson', status: 'Completed', deadline: '2024-01-20' }
  ])
  const [showNotifications, setShowNotifications] = useState(false)
 

  const mockData = {
    jdCompared: true,
    emailSent: true,
    emailTimestamp: '2024-01-15 14:30:00',
    topMatches: [
      { name: 'Alice Johnson', email: 'alice@email.com', score: 92, reasons: 'Strong Python, ML experience' },
      { name: 'Bob Smith', email: 'bob@email.com', score: 87, reasons: 'React expertise, full-stack' },
      { name: 'Carol Davis', email: 'carol@email.com', score: 83, reasons: 'Data science background' }
    ],
    rankingData: [
      { rank: 1, name: 'Alice Johnson', email: 'alice@email.com', score: 92 },
      { rank: 2, name: 'Bob Smith', email: 'bob@email.com', score: 87 },
      { rank: 3, name: 'Carol Davis', email: 'carol@email.com', score: 83 },
      { rank: 4, name: 'David Wilson', email: 'david@email.com', score: 79 },
      { rank: 5, name: 'Eva Brown', email: 'eva@email.com', score: 76 }
    ]
  }

  const workflowSteps = [
    { name: 'JD Compared', completed: mockData.jdCompared, icon: CheckCircle },
    { name: 'Profiles Ranked', completed: true, icon: Users },
    { name: 'Email Sent', completed: mockData.emailSent, icon: Mail }
  ]

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AR Requestor Panel</h2>
        </div>
        <nav className="mt-6">
          <a href="#" className="flex items-center px-6 py-3 text-blue-600 bg-blue-50 dark:bg-blue-900/20">
            <Users className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Clock className="w-5 h-5 mr-3" />
            Workflow Status
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
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">AR Requestor Dashboard</h1>
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
          {/* Workflow Progress */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Workflow Progress</h3>
            <div className="flex items-center justify-between">
              {workflowSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <step.icon className={`w-5 h-5 ${
                      step.completed ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                  </div>
                  <div className="ml-3">
                    <div className={`font-medium ${
                      step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.name}
                    </div>
                  </div>
                  {index < workflowSteps.length - 1 && (
                    <div className={`w-16 h-1 mx-4 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Cards */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">JD Comparison Status</h3>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Analysis Complete</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Job description matched against resumes</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Notifications</h3>
                <div className="flex items-center space-x-3">
                  <Mail className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {mockData.emailSent ? 'Emails Sent' : 'Pending'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {mockData.emailSent ? `Sent on ${mockData.emailTimestamp}` : 'Waiting for approval'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 3 Matches */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top 3 Matches</h3>
              <div className="space-y-4">
                {mockData.topMatches.map((match, index) => (
                  <div key={index} className="border dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 dark:text-white">{match.name}</div>
                      <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs font-semibold">
                        {match.score}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{match.email}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{match.reasons}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Consultants and Projects Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Available Consultants */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Consultants</h3>
              <div className="space-y-4">
                {consultants.map((consultant) => (
                  <div key={consultant.id} className="border dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 dark:text-white">{consultant.name}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        consultant.availability === 'Available' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {consultant.availability}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{consultant.expertise}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{consultant.rate}</span>
                      <button 
                        disabled={consultant.availability === 'Busy'}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Assignments */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Assignments</h3>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border dark:border-gray-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-gray-900 dark:text-white">{project.name}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'Completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : project.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Consultant: {project.consultant}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Deadline: {project.deadline}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ranking Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Candidate Rankings (Top 5)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Rank</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Name</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Email</th>
                    <th className="px-4 py-3 text-left text-gray-600 dark:text-gray-300">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {mockData.rankingData.map((candidate) => (
                    <tr key={candidate.rank} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{candidate.rank}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{candidate.name}</td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white">{candidate.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          candidate.score >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          candidate.score >= 75 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {candidate.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ARRequestorDashboard
 