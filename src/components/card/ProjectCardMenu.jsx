import React from 'react'
import { IoMdEye } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import { FiTrash2 } from 'react-icons/fi'
import { MdBlock } from "react-icons/md";

import TooltipHorizon from '../tooltip'

/**
 * Renders a CardMenu component.
 *
 * @param {Object} props - the properties for the CardMenu component
 * @return {JSX.Element} - a Dropdown component representing the CardMenu
 */
function ProjectCardMenu(props) {
  /**
   * A function to handle the click event for editing a project.
   *
   * @param {Object} data - the data object containing the project details
   * @return {void}
   */
  const handleEditClick = (data) => {
    // navigate(`/edit-project/${data.cellValue._id}`)
  }

  return (
    <div className="justify-left flex">
      <div className="w-max px-4 py-1 pl-0 text-sm">
        <TooltipHorizon
          // extra="border border-gray-200 dark:border-gray-700"
          trigger={
            <p
              className="flex cursor-pointer items-center rounded-full  p-1 font-bold  text-[#21346899] hover:font-medium hover:text-black dark:text-white"
              onClick={() => handleEditClick(props)}
            >
              <span>
                <MdEdit className="text-xl " />
              </span>
            </p>
          }
          content="Edit"
          placement="top"
        />
      </div>
      <div className="w-max px-4 py-1 pl-0 text-sm">
        <TooltipHorizon
          // extra="border border-gray-200 dark:border-gray-700"
          trigger={
            <p
              className="flex cursor-pointer items-center rounded-full  p-1 font-bold text-[#21346899] hover:font-medium hover:text-black dark:text-white"
            // onClick={() => handleViewClick(props)}
            >
              <span>
                <FiTrash2 className="text-xl " />
              </span>
            </p>
          }
          content="Delete"
          placement="top"
        />
      </div>
      <div className="w-max rounded-xl py-1 text-sm">
        <TooltipHorizon
          // extra="border border-gray-200 dark:border-gray-700"
          trigger={
            <p
              className="flex cursor-pointer items-center rounded-full  p-1 font-bold text-[#21346899] hover:font-medium hover:text-black dark:text-white"
            // onClick={() => handleViewClick(props)}
            >
              <span>
                <MdBlock className="text-xl " />
              </span>
            </p>
          }
          content="Block"
          placement="top"
        />
      </div>
    </div>
  )
}

export default ProjectCardMenu
