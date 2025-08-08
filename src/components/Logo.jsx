import  { Activity } from 'lucide-react'

const Logo = ({ size = 'medium' }) => {
  const sizes = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-3xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${sizes[size]} font-bold text-blue-600 dark:text-blue-400`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
          <div className="w-8 h-8 rounded-full border-2 border-white relative">
            <Activity className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping"></div>
            <div className="absolute top-1 left-1 w-2 h-2 bg-green-300 rounded-full animate-bounce"></div>
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-300 rounded-full animate-bounce delay-150"></div>
          </div>
        </div>
      </div>
      <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
        HireSight
      </span>
    </div>
  )
}

export default Logo
 