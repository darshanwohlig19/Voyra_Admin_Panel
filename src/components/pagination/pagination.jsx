import React, { useState } from 'react'

const Pagination = () => {
  const totalImages = 50 // Total number of items
  const itemsPerPage = 6 // Number of items per page
  const totalPages = Math.ceil(totalImages / itemsPerPage) // Total pages

  const [currentPage, setCurrentPage] = useState(1)

  // Function to handle page changes
  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Function to generate page numbers with dots
  const generatePageNumbers = () => {
    let pages = []

    if (totalPages <= 5) {
      // If total pages are less than or equal to 5, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show the first page, last page, and the current page
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      const start = Math.max(currentPage - 1, 2) // Ensure 1st page is always shown
      const end = Math.min(currentPage + 1, totalPages - 1) // Ensure last page is always shown
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="pagination mt-3.5 flex justify-center">
      <div className="mb-2 mt-2 flex items-center justify-center px-6">
        {/* First page button */}
        <button
          className={`h-10 w-10 rounded-full bg-red-600 text-lg text-white transition duration-200 hover:bg-red-600 active:bg-red-600 ${
            currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => changePage(1)}
          disabled={currentPage === 1}
        >
          {'<<'}
        </button>

        {/* Previous page button */}
        <button
          className={`ml-[1px] mr-[1px] h-10 w-10 rounded-full bg-red-600 text-lg text-white transition duration-200 hover:bg-red-600 active:bg-red-600 ${
            currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>

        {/* Page number buttons with dots */}
        {generatePageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => page !== '...' && changePage(page)}
            className={`h-10 w-10 rounded-full text-lg ${
              page === currentPage
                ? 'bg-red-600 text-white'
                : 'bg-white text-black'
            } transition duration-200 hover:bg-red-600 hover:text-white`}
            disabled={page === '...'}
          >
            {page}
          </button>
        ))}

        {/* Next page button */}
        <button
          className={`ml-[1px] mr-[1px] h-10 w-10 rounded-full bg-red-600 text-lg text-white transition duration-200 hover:bg-red-600 active:bg-red-600 ${
            currentPage >= totalPages ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          {'>'}
        </button>

        {/* Last page button */}
        <button
          className={`h-10 w-10 rounded-full bg-red-600 text-lg text-white transition duration-200 hover:bg-red-600 active:bg-red-600 ${
            currentPage >= totalPages ? 'cursor-not-allowed opacity-50' : ''
          }`}
          onClick={() => changePage(totalPages)}
          disabled={currentPage >= totalPages}
        >
          {'>>'}
        </button>
      </div>
    </div>
  )
}

export default Pagination
