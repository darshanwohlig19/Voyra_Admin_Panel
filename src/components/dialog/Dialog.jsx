import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
} from '@chakra-ui/modal'

import { useDialogContext } from 'contexts/DialogProvider'
import { ImSpinner } from 'react-icons/im'

/**
 * Renders a dialog component with specified content and functionality.
 *
 * @return {JSX.Element} The rendered dialog component.
 */
const Dialog = () => {
  const {
    isOpen,
    onClose,
    title,
    dialogChildren,
    modalCloseHandler,
    loading,
    modalSubmitHandler,
    cancelBtnText,
    submitBtnText,
  } = useDialogContext()

  return (
    <>
      <Modal
        onCloseComplete={modalCloseHandler}
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={onClose}
        className="!z-[1010]"
      >
        <ModalOverlay className="bg-[#000] !opacity-30" />
        <ModalContent className="!z-[1004] !m-auto max-w-[450px] rounded-[20px] bg-white bg-clip-border px-[30px] pb-[40px] pt-[35px] dark:!bg-navy-800 dark:text-white">
          <div className="mb-[20px] flex w-full items-center justify-between">
            {title && (
              <ModalHeader className="!grow text-2xl font-bold">
                {title}
              </ModalHeader>
            )}
            <ModalCloseButton />
          </div>
          <ModalBody>
            <div className="max-h-[75vh]">{dialogChildren}</div>
          </ModalBody>
          <ModalFooter className="mt-6">
            {cancelBtnText && (
              <button
                className="type-interface-01 text-default focus-visible:outline-focus-action flex cursor-pointer  items-center rounded-xl border border-solid border-gray-800 px-4 py-2 text-sm outline-2 outline-offset-2 hover:bg-brand-500 hover:text-white focus-visible:outline active:bg-gray-900 active:text-white"
                type="submit"
                onClick={() => {
                  modalCloseHandler()
                  onClose()
                }}
                disabled={loading}
              >
                {cancelBtnText}
              </button>
            )}
            {submitBtnText && (
              <button
                className={`flex cursor-pointer items-center rounded-xl border border-solid border-horizonPurple-400 bg-blueSecondary px-4 py-2 text-sm font-medium capitalize text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90 md:ml-4`}
                type="button"
                onClick={modalSubmitHandler}
                disabled={loading}
              >
                {loading && <ImSpinner className="mr-2 animate-spin" />}
                {submitBtnText}
              </button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Dialog
