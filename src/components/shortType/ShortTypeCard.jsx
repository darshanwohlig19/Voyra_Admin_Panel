import React from 'react'
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa'

const ShortTypeCard = ({ shotType, item, onEdit, onDelete }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Action Buttons */}
      <div className="absolute right-4 top-4 z-10 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <button
          onClick={() => onEdit(shotType, item)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white/95 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 hover:shadow-xl"
          title="Edit Shot Type"
        >
          <FaEdit className="text-sm" />
        </button>
        <button
          onClick={() => onDelete(shotType, item)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white/95 text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-700 hover:shadow-xl"
          title="Delete Item"
        >
          <FaTrash className="text-sm" />
        </button>
      </div>

      {/* Image */}
      <div className="h-64 w-full overflow-hidden bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <FaImage className="mx-auto text-5xl text-gray-300" />
              <p className="mt-3 text-xs font-medium text-gray-400">
                No image available
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="border-t border-gray-100 bg-white px-5 py-4">
        <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
        {item.typesubtitle && (
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {item.typesubtitle}
          </p>
        )}
      </div>
    </div>
  )
}

export default ShortTypeCard
