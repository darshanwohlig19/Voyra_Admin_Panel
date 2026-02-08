import React from 'react'
import { IoMdClose } from 'react-icons/io' // Import close icon
import ModalPortal from 'components/modal/ModalPortal'

const Modal = ({ onClose }) => {
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative flex h-[230px] w-[700px] flex-col justify-between rounded-lg bg-white text-black shadow-lg dark:bg-veryDarkBlueGray dark:text-white">
          {/* Top Section - Different Background Color */}
          <div className="flex items-center justify-between rounded-t-lg bg-gray-200 p-6 dark:bg-veryDarkBlueGray">
            <h2 className="text-4xl font-bold">Confirm Deletion</h2>
            <button
              className="text-2xl text-gray-600 hover:text-gray-900"
              onClick={onClose}
            >
              <IoMdClose />
            </button>
          </div>

          {/* Divider Line */}
          <hr className="border-gray-300" />

          {/* Bottom Section - Different Background Color */}
          <div className="rounded-b-lg bg-white  p-6 dark:bg-darkGrayishBlue">
            <p className="text-2xl">
              Are you sure you want to delete this item?
            </p>

            {/* Spaced-out Buttons */}
            <div className="mt-5 flex justify-end space-x-3">
              <button
                className="rounded-md bg-gray-300 px-5 py-3 text-lg text-black"
                onClick={onClose}
              >
                Cancel
              </button>
              <button className="rounded-md bg-vividSkyBlue px-5 py-3 text-lg text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  )
}

export default Modal
