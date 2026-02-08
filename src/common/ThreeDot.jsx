import React, { createContext, useContext, useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import ModalPortal from 'components/modal/ModalPortal'

/**
 * @typedef {Object} SpinnerContextValue
 * @property {Function} showSpinner - Function to show the spinner.
 * @property {Function} hideSpinner - Function to hide the spinner.
 */

/**
 * Context for managing the spinner state.
 * @type {React.Context<SpinnerContextValue>}
 */
const SpinnerContext = createContext()

/**
 * Provider component for managing the spinner state.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactNode} The spinner provider component.
 */
export const SpinnerProvider = ({ children }) => {
  /**
   * State to manage the loading state of the spinner.
   * @type {[boolean, Function]} - Tuple containing the loading state and function to set the loading state.
   */
  const [loading, setLoading] = useState(false)

  /**
   * Function to show the spinner.
   */
  const showSpinner = () => setLoading(true)

  /**
   * Function to hide the spinner.
   */
  const hideSpinner = () => setLoading(false)

  return (
    <SpinnerContext.Provider value={{ showSpinner, hideSpinner }}>
      {children}
      {loading && (
        <ModalPortal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
          >
            <ThreeDots
              visible={true}
              height={80}
              width={80}
              color="#4fa94d"
              radius={9}
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </div>
        </ModalPortal>
      )}
    </SpinnerContext.Provider>
  )
}

/**
 * Hook for accessing the spinner context.
 * @returns {SpinnerContextValue} The spinner context value containing the showSpinner and hideSpinner functions.
 */
export const useSpinner = () => useContext(SpinnerContext)
