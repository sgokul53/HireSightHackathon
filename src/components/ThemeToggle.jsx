import  { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
       <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-12 glass-effect interactive"
      aria-label="Toggle theme"
    > 
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  )
}

export default ThemeToggle
 