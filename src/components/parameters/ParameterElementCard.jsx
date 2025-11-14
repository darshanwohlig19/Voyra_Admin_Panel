import React, { useState, useEffect, useRef } from 'react'
import { FaEdit, FaTrash, FaChevronDown } from 'react-icons/fa'

const ParameterElementCard = ({ element, onEdit, onDelete }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showExpandButton, setShowExpandButton] = useState(false)
  const textRef = useRef(null)
  const compactTextRef = useRef(null)

  // Check if text overflows beyond line-clamp
  useEffect(() => {
    const checkOverflow = () => {
      const currentRef = !element.image
        ? compactTextRef.current
        : textRef.current
      if (currentRef && element.prompt) {
        // Temporarily remove line-clamp to get natural height
        const originalDisplay = currentRef.style.webkitLineClamp
        const originalOverflow = currentRef.style.webkitBoxOrient
        const originalTextOverflow = currentRef.style.display

        currentRef.style.webkitLineClamp = 'unset'
        currentRef.style.webkitBoxOrient = 'unset'
        currentRef.style.display = 'block'

        const naturalHeight = currentRef.scrollHeight

        // Restore line-clamp
        currentRef.style.webkitLineClamp =
          originalDisplay || (!element.image ? '2' : '3')
        currentRef.style.webkitBoxOrient = originalOverflow || 'vertical'
        currentRef.style.display = originalTextOverflow || '-webkit-box'

        const clampedHeight = currentRef.clientHeight
        setShowExpandButton(naturalHeight > clampedHeight)
      }
    }

    // Small delay to ensure DOM is rendered
    const timeoutId = setTimeout(checkOverflow, 100)
    return () => clearTimeout(timeoutId)
  }, [element.prompt, element.image])

  // Compact layout for elements without images
  if (!element.image) {
    return (
      <div className="group relative overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm ring-1 ring-gray-200/30 transition-all duration-300 hover:-translate-y-1 hover:border-gray-300/80 hover:shadow-lg hover:shadow-gray-400/10 hover:ring-gray-300/40">
        {/* Compact Action Buttons */}
        <div className="absolute right-3 top-3 z-20 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={() => onEdit(element)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/90 text-gray-500 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-blue-200 hover:bg-blue-50/90 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-90"
            title="Edit Element"
          >
            <FaEdit className="text-xs" />
          </button>

          <button
            onClick={() => onDelete(element)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/90 text-gray-500 shadow-md backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:border-red-200 hover:bg-red-50/90 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-90"
            title="Delete Element"
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
                {element.name}
              </h3>
              {element.prompt && (
                <div>
                  <div className="relative">
                    <p
                      ref={compactTextRef}
                      className={`mt-1 text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover:text-gray-700 ${
                        isExpanded
                          ? 'cursor-pointer whitespace-pre-wrap'
                          : 'line-clamp-2'
                      }`}
                      onClick={
                        isExpanded ? () => setIsExpanded(false) : undefined
                      }
                    >
                      {element.prompt}
                    </p>

                    {/* Show expand button only if text overflows and not expanded */}
                    {showExpandButton && !isExpanded && (
                      <div className="mt-2 flex justify-start">
                        <button
                          onClick={() => setIsExpanded(true)}
                          className="bg-emerald-50/80 text-emerald-700 hover:bg-emerald-100/90 focus:ring-emerald-500/40 group inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 active:scale-95"
                        >
                          <span className="group-hover:text-emerald-800 transition-colors duration-150">
                            Show More
                          </span>
                          <div className="bg-emerald-200/60 group-hover:bg-emerald-300/80 flex h-3 w-3 items-center justify-center rounded-full transition-all duration-150">
                            <FaChevronDown className="text-emerald-700 text-[7px]" />
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
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

  // Full card layout for elements with images
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 transition-all duration-700 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-400/20 hover:ring-gray-300/60 active:scale-[0.98] active:duration-150">
      {/* Floating Action Buttons */}
      <div className="absolute right-4 top-4 z-20 flex translate-y-2 transform gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <button
          onClick={() => onEdit(element)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/80 text-gray-500 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-blue-200 hover:bg-blue-50/90 hover:text-blue-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-90"
          title="Edit Element"
        >
          <FaEdit className="text-sm" />
        </button>

        <button
          onClick={() => onDelete(element)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/80 text-gray-500 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-red-200 hover:bg-red-50/90 hover:text-red-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-90"
          title="Delete Element"
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
          src={element.image}
          alt={element.name}
          onLoad={() => setIsImageLoaded(true)}
          className={`h-full w-full object-contain transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Content Section */}
      <div className="relative bg-white p-6">
        {/* Title */}
        <h2 className="mb-3 line-clamp-2 text-xl font-bold leading-tight text-gray-900 transition-colors duration-200 group-hover:text-gray-800">
          {element.name}
        </h2>

        {/* Description with Expand/Collapse */}
        {element.prompt && (
          <div className="mb-4">
            <div className="relative">
              <p
                ref={textRef}
                className={`text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover:text-gray-700 ${
                  isExpanded
                    ? 'cursor-pointer whitespace-pre-wrap'
                    : 'line-clamp-3'
                }`}
                onClick={isExpanded ? () => setIsExpanded(false) : undefined}
              >
                {element.prompt}
              </p>

              {/* Show expand button only if text overflows and not expanded */}
              {showExpandButton && !isExpanded && (
                <div className="mt-3 flex justify-start">
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="from-emerald-50 text-emerald-700 hover:ring-emerald-300/60 focus:ring-emerald-500/50 group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r to-teal-50 px-4 py-2 text-xs font-medium shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95"
                  >
                    <span className="group-hover:text-emerald-800 transition-colors duration-200">
                      Show More
                    </span>
                    <div className="bg-emerald-100 group-hover:bg-emerald-200 flex h-4 w-4 items-center justify-center rounded-full transition-all duration-200">
                      <FaChevronDown className="text-emerald-600 text-[9px] transition-transform duration-200 group-hover:scale-110" />
                    </div>

                    {/* Subtle glow effect */}
                    <div className="from-emerald-200/30 absolute -inset-0.5 -z-10 rounded-full bg-gradient-to-r to-teal-200/30 opacity-0 blur transition-opacity duration-300 group-hover:opacity-100" />
                  </button>
                </div>
              )}
            </div>
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

export default ParameterElementCard
