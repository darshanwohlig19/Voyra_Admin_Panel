import React, { createContext, useState, useEffect, useContext } from 'react'

// Create a new context for the theme
const ThemeContext = createContext()

// Create a ThemeProvider component to wrap your App component
export const ThemeProvider = ({ children }) => {
  const [darkmode, setDarkmode] = useState({
    '--background-100': '#F4F7FE',
    '--background-900': '#070f2e',
    '--shadow-100': 'rgba(112, 144, 176, 0.08)',
    '--color-50': '#E9E3FF',
    '--color-100': '#C0B8FE',
    '--color-200': '#A195FD',
    '--color-300': '#8171FC',
    '--color-400': '#7551FF',
    '--color-500': '#422AFB',
    '--color-600': '#3311DB',
    '--color-700': '#2111A5',
    '--color-800': '#190793',
    '--color-900': '#11047A',
  })

  useEffect(() => {
    // Update document styles when themeApp changes
    let color
    for (color in darkmode) {
      document.documentElement.style.setProperty(color, darkmode[color])
    }
    if (localStorage?.darkmode === 'true') {
      localStorage.setItem('darkMode', JSON.stringify(false))
    }
  }, [darkmode])

  return (
    <ThemeContext.Provider value={{ darkmode, setDarkmode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Custom hook to access theme context
export const useTheme = () => useContext(ThemeContext)
