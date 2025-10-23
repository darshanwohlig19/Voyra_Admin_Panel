import React from 'react'
import { FaEdit, FaTrash, FaImage } from 'react-icons/fa'

const ShortTypeCard = ({ shotType, onEdit, onDelete }) => {
  const { title, subtitle, items = [] } = shotType

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50/50 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {subtitle}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onEdit(shotType)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:shadow"
              title="Edit Shot Type"
            >
              <FaEdit className="text-sm" />
            </button>
            <button
              onClick={() => onDelete(shotType)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:shadow"
              title="Delete Shot Type"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {items.length > 0 ? (
          <div className="space-y-5">
            {items.map((item, index) => (
              <div
                key={item._id || index}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Image */}
                <div className="h-52 w-full overflow-hidden bg-gray-100">
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.name}
                  </h3>
                  {item.typesubtitle && (
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                      {item.typesubtitle}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex h-56 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/30">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <FaImage className="text-3xl text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-700">
                No options yet
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Add your first shot type option
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShortTypeCard
