import { createContext, useContext, useEffect, useState } from 'react'
import { useDisclosure } from '@chakra-ui/hooks'

const DialogContext = createContext()

export const useDialogContext = () => useContext(DialogContext)

/**
 * A provider component that manages dialog state and functionality.
 *
 * @param {Object} children - The child components to be rendered within the provider.
 * @return {JSX.Element} The provider component with dialog context values.
 */
export const DialogProvider = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [title, setTitle] = useState('')
  const [cancelBtnText, setCancelBtnText] = useState('')
  const [submitBtnText, setSubmitBtnText] = useState('')
  const [dialogChildren, setDialogChildren] = useState(null)
  const [modalCloseHandler, setModalCloseHandler] = useState()
  const [loading, setLoading] = useState(false)
  const [modalSubmitHandler, setModalSubmitHandler] = useState()

  /**
   * A function that opens a dialog with the provided title, content, submit button text, and cancel button text.
   *
   * @param {string} title - The title of the dialog.
   * @param {JSX.Element} content - The content to be displayed in the dialog.
   * @param {string} submitBtnText - The text for the submit button.
   * @param {string} cancelBtnText - The text for the cancel button.
   */
  const openDialog = (title, content, submitBtnText, cancelBtnText) => {
    setTitle(title)
    setDialogChildren(content)
    onOpen()
    if (submitBtnText) setSubmitBtnText(submitBtnText)
    if (cancelBtnText) setCancelBtnText(cancelBtnText)
    if (!modalCloseHandler) {
      setModalCloseHandler(() => onClose)
    }
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('bearerToken') ? true : false // You should implement your own authentication logic

    if (!isAuthenticated && isOpen) {
      onClose()
    }
  }, [isOpen, onClose])

  return (
    <DialogContext.Provider
      value={{
        isOpen,
        openDialog,
        onClose,
        title,
        dialogChildren,
        modalCloseHandler,
        setModalCloseHandler,
        loading,
        setLoading,
        modalSubmitHandler,
        setModalSubmitHandler,
        cancelBtnText,
        submitBtnText,
      }}
    >
      {children}
    </DialogContext.Provider>
  )
}
