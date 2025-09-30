import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { createPortal } from 'react-dom'
import { AiFillExclamationCircle } from 'react-icons/ai'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import SolidSubtleMultiAlert from 'views/others/notifications/components/SolidSubtleMultiAlert'

/**
 * Context for managing toast notifications.
 * @type {React.Context<{ addToast: Function, removeToast: Function }>}
 */
const ToasterContext = createContext()

/**
 * Hook for accessing the toast context.
 * @returns {{ addToast: Function, removeToast: Function }} The toast context containing the addToast and removeToast functions.
 */
export const useToaster = () => {
  const context = useContext(ToasterContext)
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider')
  }
  return context
}

/**
 * Provider component for managing toast notifications.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactNode} The toast provider component.
 */
export const ToasterProvider = ({ children }) => {
  const [toast, setToast] = useState(null)

  /**
   * Object mapping toast types to icon colors.
   * @type {Object.<string, string>}
   */
  const toastTypeIconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blueSecondary',
  }

  /**
   * Object mapping toast types to Background colors.
   * @type {Object.<string, string>}
   */
  const toastBgColors = {
    success: 'bg-[#C9FBD5] dark:!bg-navy-700',
    error: 'bg-[#FDE0D0] dark:!bg-navy-700',
    warning: 'bg-[#FFF6DA] dark:!bg-navy-700',
    info: 'bg-[#E9E3FF] dark:!bg-navy-700',
  }

  /**
   * Function to add a new toast notification.
   * @param {Object} toastData - The toast data.
   * @param {string} toastData.type - The type of toast notification (e.g., success, error, warning, info).
   * @param {string} toastData.title - The title of the toast notification.
   * @param {string} toastData.description - The description of the toast notification.
   * @param {number} [toastData.duration=5000] - The duration in milliseconds for which the toast should be displayed.
   */
  const addToast = useCallback((toastData) => {
    const iconColor = toastTypeIconColors[toastData.type] || ''
    const bgColor = toastBgColors[toastData.type] || ''
    setToast({ ...toastData, iconColor, bgColor })
    setTimeout(() => {
      removeToast()
    }, toastData.duration || 5000)
  }, [])

  /**
   * Function to remove the current toast notification.
   */
  const removeToast = useCallback(() => {
    setToast(null)
  }, [])

  // Create a div element for rendering toast notifications
  const toasterContainer = document.createElement('div')
  toasterContainer.className = 'toast-container'
  document.body.appendChild(toasterContainer)

  // Clean up the div element when the component is unmounted
  useEffect(() => {
    return () => {
      document.body.removeChild(toasterContainer)
    }
  }, [toasterContainer])

  return (
    <ToasterContext.Provider value={{ addToast, removeToast }}>
      {children}
      {toast &&
        createPortal(
          <div className="toast">
            <SolidSubtleMultiAlert
              title={toast.title}
              description={toast.description}
              iconColor={toast.iconColor}
              icon={
                toast?.type === 'success' ? (
                  <BsFillCheckCircleFill />
                ) : (
                  <AiFillExclamationCircle />
                )
              }
              closeBg="hover:bg-white/20 text-navy-900 dark:text-white"
              bg={toast.bgColor}
              removeToast={removeToast}
            />
          </div>,
          toasterContainer
        )}
    </ToasterContext.Provider>
  )
}
