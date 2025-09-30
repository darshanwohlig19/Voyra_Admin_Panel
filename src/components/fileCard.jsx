import React, { useState } from 'react'
import FolderImage from '../../src/assets/webp/folder.webp'
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs'
import { IoMdEye } from 'react-icons/io'
import { MdEdit } from 'react-icons/md'
import { FiTrash2 } from 'react-icons/fi'
import { AiOutlineDownload } from 'react-icons/ai'
import { IoArrowBack } from 'react-icons/io5'
import TooltipHorizon from '../components/tooltip'
import { useLocation } from 'react-router-dom'

// Inside FileCard component

const FileCard = ({ items, onItemClick, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const handleMenuToggle = (id) => {
    setMenuOpen((prev) => (prev === id ? null : id))
  }

  const handleEditClick = (id, name) => {
    setEditingId(id)
    setEditText(name)
    setMenuOpen(null)
  }

  const handleSaveEdit = (id) => {
    onEdit(id, editText)
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }
  const location = useLocation()
  const isRecycleBin = location.pathname === '/recyclebin'
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.id}
          className="relative cursor-pointer rounded-lg bg-white p-4  shadow transition-shadow hover:shadow-md dark:bg-darkGrayishBlue"
        >
          {editingId === item.id ? (
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <img
                  src={FolderImage}
                  alt="Folder Icon"
                  className="mr-3 h-12 w-12"
                />
                <input
                  type="text"
                  value={editText}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveEdit(item.id)
                    }
                  }}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full rounded border border-gray-300 px-2 py-1"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="rounded bg-gray-200 px-2 py-1 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveEdit(item.id)}
                  className="rounded bg-blue-500 px-2 py-1 text-sm text-white"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                onClick={() => onItemClick(item.id, item.name)}
                className="flex items-center"
              >
                <img
                  src={FolderImage}
                  alt="Folder Icon"
                  className="mr-3 h-12 w-12"
                />
                {/* <span className="font-montserrat p-2 font-semibold text-blueGray dark:text-white truncate">
                  {item.name} */}
                <TooltipHorizon
                  trigger={
                    <span className="truncate p-2 font-montserrat font-semibold text-blueGray dark:text-white">
                      {item.name}
                    </span>
                  }
                  content={item.name}
                  placement="top"
                />
              </div>

              {/* Three-dot menu */}
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  handleMenuToggle(item.id)
                }}
              >
                <BsThreeDotsVertical className="text-gray-500 dark:text-white" />
              </div>

              {/* Dropdown menu */}
              {menuOpen === item.id && (
                <div className="absolute right-0 top-10 z-10 w-40 rounded-md bg-white shadow-lg">
                  <ul className="py-1 text-sm text-gray-700 dark:bg-darkGrayishBlue dark:text-white">
                    {!isRecycleBin && (
                      <>
                        <li
                          className="flex cursor-pointer items-center gap-2 px-4 py-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(item.id, item.name)
                          }}
                        >
                          <MdEdit className="text-gray-600" /> Edit
                        </li>
                        <li
                          className="flex cursor-pointer items-center gap-2 px-4 py-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(item.id)
                            setMenuOpen(null)
                          }}
                        >
                          <FiTrash2 className="text-gray-600" /> Delete
                        </li>
                      </>
                    )}

                    {isRecycleBin && (
                      <>
                        <li
                          className="flex cursor-pointer items-center gap-2 px-4 py-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditClick(item.id, item.name)
                          }}
                        >
                          <IoArrowBack className="text-gray-600" /> Put Back
                        </li>
                        <li
                          className="flex cursor-pointer items-center gap-2 px-4 py-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(item.id)
                            setMenuOpen(null)
                          }}
                        >
                          <FiTrash2 className="text-gray-600" /> Erase
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default FileCard
