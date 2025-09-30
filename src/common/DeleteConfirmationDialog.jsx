import React from 'react'

const DeleteConfirmationDialog = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-72 rounded-lg bg-white p-6 shadow-lg">
            <p className="mb-4 text-lg text-gray-800">
              Are you sure you want to delete?
            </p>
            <div className="flex justify-end">
              <button
                className="mr-2 rounded bg-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-300"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={onConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DeleteConfirmationDialog
