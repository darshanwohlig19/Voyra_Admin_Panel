import React, { useState } from 'react'
import { IoMdEye } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import { FiTrash2 } from 'react-icons/fi'
import { AiOutlineDownload } from 'react-icons/ai'

import TooltipHorizon from '../tooltip'
import Modal from 'components/modal/Confirmation' // Import the modal component

function NewIconCard(props) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleEditClick = (data) => {
    // navigate(`/edit-project/${data.cellValue._id}`)
  }

  return (
    <>
      <div className="flex items-center space-x-1">
        {/* Edit */}
        <TooltipHorizon
          trigger={
            <p
              className="flex cursor-pointer items-center rounded-full p-2 text-coolgray hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => handleEditClick(props)}
            >
              <MdEdit className="text-xl" />
            </p>
          }
          content="Edit"
          placement="top"
        />

        {/* Delete */}
        <TooltipHorizon
          trigger={
            <p
              className="flex cursor-pointer items-center rounded-full p-2 text-coolgray hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsModalOpen(true)} // Open modal on click
            >
              <FiTrash2 className="text-xl" />
            </p>
          }
          content="Delete"
          placement="top"
        />

        {/* View */}
        <TooltipHorizon
          trigger={
            <a
              href={props.cellValue?.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer items-center rounded-full p-2 text-coolgray hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <IoMdEye className="text-xl" />
            </a>
          }
          content="View"
          placement="top"
        />

        {/* Download */}
        <TooltipHorizon
          trigger={
            <a
              href={props.cellValue?.fileUrl}
              download
              className="flex cursor-pointer items-center rounded-full p-2 text-coolgray hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <AiOutlineDownload className="text-xl" />
            </a>
          }
          content="Download"
          placement="top"
        />
      </div>

      {/* Modal Component */}
      {isModalOpen && <Modal onClose={() => setIsModalOpen(false)} />}
    </>
  )
}

export default NewIconCard
