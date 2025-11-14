import React, { useState, useEffect, useRef } from 'react'
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa'

const ShortTypeCard = ({ shotType, item, onEdit, onDelete }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showExpandButton, setShowExpandButton] = useState(false)
  const textRef = useRef(null)
  const compactTextRef = useRef(null)

  // Check if text overflows for compact layout
  useEffect(() => {
    if (compactTextRef.current && item.typesubtitle) {
      const element = compactTextRef.current
      setShowExpandButton(element.scrollHeight > element.clientHeight)
    }
  }, [item.typesubtitle])

  // Check if text overflows for full layout
  useEffect(() => {
    if (textRef.current && item.typesubtitle) {
      const element = textRef.current
      setShowExpandButton(element.scrollHeight > element.clientHeight)
    }
  }, [item.typesubtitle])

  // Compact layout for items without images
  if (!item.image) {
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm ring-1 ring-gray-200/30 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300/80 hover:shadow-lg hover:shadow-gray-400/10 hover:ring-gray-300/40">
        {/* Compact Action Buttons */}
        <div className="absolute right-3 top-3 z-20 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={() => onEdit(shotType, item)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/90 text-gray-500 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-blue-200 hover:bg-blue-50/90 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-90"
            title="Edit Shot Type"
          >
            <FaEdit className="text-xs" />
          </button>

          <button
            onClick={() => onDelete(shotType, item)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/90 text-gray-500 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-red-200 hover:bg-red-50/90 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-90"
            title="Delete Item"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>

        {/* Compact Content */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Text Content */}
            <div className="min-w-0 flex-1">
              <h3 className="line-clamp-1 font-semibold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-gray-700">
                {item.name}
              </h3>
              {item.typesubtitle && (
                <div>
                  <p
                    ref={compactTextRef}
                    className={`mt-1 text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover:text-gray-700 ${
                      isExpanded ? '' : 'line-clamp-2'
                    }`}
                  >
                    {item.typesubtitle}
                  </p>

                  {/* Show expand button only if text overflows */}
                  {showExpandButton && (
                    <div className="mt-2 flex justify-start">
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="bg-emerald-50/80 text-emerald-700 ring-emerald-200/50 hover:bg-emerald-100/90 hover:ring-emerald-300/60 focus:ring-emerald-500/40 group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium ring-1 transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 active:scale-95"
                      >
                        <span className="group-hover:text-emerald-800 transition-colors duration-150">
                          {isExpanded ? 'Less' : 'More'}
                        </span>
                        <div className="bg-emerald-200/60 group-hover:bg-emerald-300/80 flex h-3 w-3 items-center justify-center rounded-full transition-all duration-150">
                          {isExpanded ? (
                            <FaChevronUp className="text-emerald-700 text-[7px]" />
                          ) : (
                            <FaChevronDown className="text-emerald-700 text-[7px]" />
                          )}
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Compact bottom accent */}
          <div className="from-emerald-500 absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 transform bg-gradient-to-r to-teal-500 transition-transform duration-300 group-hover:scale-x-100" />
        </div>
      </div>
    )
  }

  // Full card layout for items with images
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-400/20 hover:ring-gray-300/60 active:scale-[0.98] active:duration-150">
      {/* Floating Action Buttons */}
      <div className="absolute right-4 top-4 z-20 flex translate-y-2 transform gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <button
          onClick={() => onEdit(shotType, item)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/80 text-gray-500 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-blue-200 hover:bg-blue-50/90 hover:text-blue-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-90"
          title="Edit Shot Type"
        >
          <FaEdit className="text-sm" />
        </button>

        <button
          onClick={() => onDelete(shotType, item)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/80 text-gray-500 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-red-200 hover:bg-red-50/90 hover:text-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-90"
          title="Delete Item"
        >
          <FaTrash className="text-sm" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
        {!isImageLoaded && (
          <div
            className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_200%]"
            style={{ animation: 'shimmer 2s infinite' }}
          />
        )}
        <img
          src={item.image}
          alt={item.name}
          onLoad={() => setIsImageLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Content Section */}
      <div className="relative bg-white p-6">
        {/* Title */}
        <h2 className="mb-3 line-clamp-2 text-xl font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-gray-800">
          {item.name}
        </h2>

        {/* Description with Expand/Collapse */}
        {item.typesubtitle && (
          <div className="mb-4">
            <p
              ref={textRef}
              className={`text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover:text-gray-700 ${
                isExpanded ? '' : 'line-clamp-3'
              }`}
            >
              {item.typesubtitle}
            </p>

            {/* Show expand button only if text overflows */}
            {showExpandButton && (
              <div className="mt-3 flex justify-center">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="from-emerald-50 text-emerald-700 hover:ring-emerald-300/60 focus:ring-emerald-500/50 group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r to-teal-50 px-4 py-2 text-xs font-medium shadow-sm ring-1 ring-indigo transition-all duration-300 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95"
                >
                  <span className="group-hover:text-emerald-800 transition-colors duration-200">
                    {isExpanded ? 'Show less' : 'Show more'}
                  </span>
                  <div className="bg-emerald-100 group-hover:bg-emerald-200 flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200">
                    {isExpanded ? (
                      <FaChevronUp className="text-emerald-600 text-[9px] transition-transform duration-200 group-hover:scale-110" />
                    ) : (
                      <FaChevronDown className="text-emerald-600 text-[9px] transition-transform duration-200 group-hover:scale-110" />
                    )}
                  </div>

                  {/* Subtle glow effect */}
                  <div className="from-emerald-200/30 absolute -inset-0.5 -z-10 rounded-full bg-gradient-to-r to-teal-200/30 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Premium Gradient Border */}
        <div className="from-emerald-500 absolute bottom-0 left-0 right-0 h-1 origin-left scale-x-0 transform rounded-full bg-gradient-to-r via-teal-500 to-cyan-500 transition-transform duration-700 group-hover:scale-x-100" />
      </div>

      {/* Floating Glow Effect */}
      <div className="from-emerald-500/20 absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r via-teal-500/20 to-cyan-500/20 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100" />
    </div>
  )
}

export default ShortTypeCard
