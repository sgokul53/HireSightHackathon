import  axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Mock API responses for development
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      // Return mock responses when server is not available
      const { method, url, data } = error.config
      
      if (method === 'post' && url.includes('/auth/login')) {
        const { email, password } = JSON.parse(data)
        
        // Mock users database
        const users = [
          { id: 1, email: 'recruiter@example.com', password: 'password123', role: 'recruiter', firstName: 'John', lastName: 'Doe' },
          { id: 2, email: 'ar@example.com', password: 'password123', role: 'ar-requestor', firstName: 'Jane', lastName: 'Smith' },
          { id: 3, email: 'candidate@example.com', password: 'password123', role: 'candidate', firstName: 'Bob', lastName: 'Johnson' },
          { id: 4, email: 'admin@example.com', password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'User' }
        ]
        
        const user = users.find(u => u.email === email && u.password === password)
        
        if (user) {
          return Promise.resolve({
            data: {
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                name: `${user.firstName} ${user.lastName}`
              },
              token: 'mock-jwt-token'
            }
          })
        } else {
          return Promise.reject({
            response: {
              data: { message: 'Invalid email or password' },
              status: 401
            }
          })
        }
      }
      
      if (method === 'post' && url.includes('/auth/register')) {
        return Promise.resolve({
          data: { message: 'Registration successful! Please login.' }
        })
      }
      
      // Mock other API endpoints as needed
      return Promise.resolve({ data: {} })
    }
    
    return Promise.reject(error)
  }
)

export default api
 