export  class ActivityService {
  constructor() {
    this.activities = this.loadActivities()
  }

  loadActivities() {
    const stored = localStorage.getItem('userActivities')
    return stored ? JSON.parse(stored) : []
  }

  saveActivities() {
    localStorage.setItem('userActivities', JSON.stringify(this.activities))
  }

  addActivity(action, user, type, metadata = {}) {
    const activity = {
      id: Date.now() + Math.random(),
      action,
      user,
      type,
      time: this.formatTime(new Date()),
      timestamp: Date.now(),
      metadata
    }
    
    this.activities.unshift(activity)
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(0, 100)
    }
    
    this.saveActivities()
    this.dispatchActivityEvent(activity)
  }

  formatTime(date) {
    const now = new Date()
    const diff = now - date
    
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hour ago`
    return `${Math.floor(diff / 86400000)} day ago`
  }

  dispatchActivityEvent(activity) {
    window.dispatchEvent(new CustomEvent('newActivity', { detail: activity }))
  }

  getActivitiesByUser(userId) {
    return this.activities.filter(activity => activity.user.includes(userId))
  }

  getActivitiesByType(type) {
    return this.activities.filter(activity => activity.type === type)
  }

  getRecentActivities(limit = 10) {
    return this.activities.slice(0, limit)
  }

  clearOldActivities() {
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    this.activities = this.activities.filter(activity => activity.timestamp > oneWeekAgo)
    this.saveActivities()
  }
}

export const activityService = new ActivityService()

// Activity tracking helpers
export const trackActivity = (action, user, type, metadata) => {
  activityService.addActivity(action, user, type, metadata)
}

export const trackFileUpload = (fileName, fileType, user) => {
  trackActivity(`Uploaded ${fileType}: ${fileName}`, user, 'upload', { fileName, fileType })
}

export const trackAnalysis = (analysisType, user, results) => {
  trackActivity(`Generated ${analysisType} analysis`, user, 'analysis', { analysisType, results })
}

export const trackEmailSent = (recipients, user) => {
  trackActivity(`Sent emails to ${recipients.length} candidates`, user, 'email', { recipients })
}

export const trackResumeShare = (candidateName, sharedWith, user) => {
  trackActivity(`Shared ${candidateName}'s resume with ${sharedWith}`, user, 'share', { candidateName, sharedWith })
}

export const trackJobApplication = (jobTitle, candidateName) => {
  trackActivity(`Applied for ${jobTitle} position`, candidateName, 'application', { jobTitle })
}

export const trackRanking = (candidateCount, user) => {
  trackActivity(`Ranked ${candidateCount} candidates`, user, 'ranking', { candidateCount })
}

export const trackLogin = (user, role) => {
  trackActivity(`Logged in as ${role}`, user, 'login', { role })
}

export const trackExport = (exportType, user) => {
  trackActivity(`Exported ${exportType} data`, user, 'export', { exportType })
}
 