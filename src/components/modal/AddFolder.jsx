import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const AddFolder = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('')
  const location = useLocation()

  let modalTitle = 'Add New Department'
  let buttonText = 'Create Department'
  let folderType = 'department'
  let parentFolder = ''

  // Determine the type based on the current path
  if (location.pathname.includes('/subdepartment')) {
    modalTitle = 'Add New Sub Department'
    buttonText = 'Create Sub Department'
    folderType = 'subdepartment'

    // Get parent department from localStorage if we're in subdepartment view
    const selectedDepartment = JSON.parse(
      localStorage.getItem('selectedDepartment')
    )
    parentFolder = selectedDepartment ? selectedDepartment.id : null
  } else if (location.pathname.includes('/folders')) {
    modalTitle = 'Add New Folder'
    buttonText = 'Create Folder'
    folderType = 'folder'

    // If we need parent folder ID for regular folders, get it from somewhere
    // (localStorage, props, etc.)
  }

  const handleAdd = () => {
    if (name.trim()) {
      // Pass all required parameters to the onAdd function
      onAdd(name.trim(), parentFolder, folderType)
      setName('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex h-[300px] w-[600px] flex-col rounded-lg bg-white text-black shadow-lg dark:bg-veryDarkBlueGray">
        {/* Title & Close Button */}
        <div className="flex items-center justify-between px-8 py-6">
          <h2 className="text-2xl font-semibold dark:text-white">
            {modalTitle}
          </h2>
          <button
            className="text-2xl text-gray-600 hover:text-gray-900 dark:text-white"
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        {/* Bottom Section with Different Background Color */}
        <div className="flex flex-grow flex-col justify-between rounded-b-lg bg-[#F5F6FA] p-6 dark:bg-darkGrayishBlue">
          {/* Input Field */}
          <div>
            <label className="mb-2 block text-lg font-medium text-gray-700 dark:text-white">
              {modalTitle.replace('Add New ', '')} Name
            </label>
            <input
              type="text"
              placeholder={`Enter ${modalTitle
                .replace('Add New ', '')
                .toLowerCase()} name`}
              className="w-full rounded-md border bg-white px-4 py-2 text-lg text-black focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-darkGrayishBlue dark:text-white dark:focus:ring-blue-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAdd()
                }
              }}
            />
          </div>

          {/* Button at Right End */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAdd}
              className="rounded-md bg-[#ebd6ac] px-6 py-3 text-lg text-white hover:bg-[#EDCF93]"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddFolder
