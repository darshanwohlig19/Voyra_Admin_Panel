import React from 'react'
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa'

const ShortTypeCard = ({ shotType, item, onEdit, onDelete }) => {
  const { title, subtitle } = shotType

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-500">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(shotType)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:shadow"
              title="Edit Shot Type"
            >
              <FaEdit className="text-xs" />
            </button>
            <button
              onClick={() => onDelete(shotType, item)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:shadow"
              title="Delete Item"
            >
              <FaTrash className="text-xs" />
            </button>
          </div>
        </div>
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
