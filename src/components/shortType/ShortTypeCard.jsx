import React from 'react'
import { FaEdit, FaTrash, FaImage, FaClock } from 'react-icons/fa'
import { MdPhotoCamera } from 'react-icons/md'

const ShortTypeCard = ({ shotType, onEdit, onDelete }) => {
  const { title, subtitle, items = [], createdAt } = shotType

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      {/* Card Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(shotType)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-md transition-all hover:bg-blue-500 hover:text-white"
              title="Edit"
            >
              <FaEdit className="text-xs" />
            </button>
            <button
              onClick={() => onDelete(shotType)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-600 shadow-md transition-all hover:bg-red-500 hover:text-white"
              title="Delete"
            >
              <FaTrash className="text-xs" />
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <FaClock />
          <span>Created: {formatDate(createdAt)}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Items Display */}
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item._id || index}
                className="group/item relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Image Preview */}
                <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-gray-100">
                  {item.image ? (
                    <>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover/item:scale-105"
                      />
                      <div className="via-transparent to-transparent absolute inset-0 bg-gradient-to-t from-black/70"></div>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FaImage className="text-4xl text-gray-300" />
                    </div>
                  )}

                  {/* Item Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base font-bold text-white drop-shadow-lg">
                      {item.name}
                    </h3>
                    {item.typesubtitle && (
                      <p className="mt-1 text-xs text-white/95 drop-shadow-md">
                        {item.typesubtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex h-40 items-center justify-center rounded-xl bg-gray-50">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                <FaImage className="text-2xl text-gray-400" />
              </div>
              <p className="mt-2 text-sm font-medium text-gray-500">
                No shot types added
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShortTypeCard
