/**
 * Renders a skeleton component for pagination.
 *
 * @return {JSX.Element} The pagination skeleton component.
 */
const PaginationSkeleton = () => {
  const paginationBtnSkeletons = Array.from({ length: 5 })

  return (
    <div className="mt-2 flex h-12 w-full animate-pulse items-center justify-between px-6">
      <div className="h-2 w-1/6 rounded bg-gray-200 dark:bg-gray-800"></div>
      <div className="flex gap-x-3">
        {paginationBtnSkeletons.map((_item, index) => (
          <div
            key={index}
            className="rounded-full bg-gray-200 p-5 dark:bg-gray-800"
          ></div>
        ))}
      </div>
    </div>
  )
}

export default PaginationSkeleton
