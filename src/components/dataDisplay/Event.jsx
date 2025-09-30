/**
 * Generate an Event component with the given props.
 *
 * @param {object} props - The properties for the Event component.
 * @return {JSX.Element} The Event component JSX.
 */
const Event = (props) => {
  const { title, time, eventBg, mb } = props
  return (
    <div
      className={`flex w-full flex-col dark:!bg-navy-700 ${eventBg} ${mb} rounded-xl px-4 py-3 3xl:p-4 `}
    >
      <h5 className="text-base font-bold text-navy-700 dark:text-white">
        {title}{' '}
      </h5>
      <p className="text-sm font-medium text-gray-600"> {time} </p>
    </div>
  )
}

export default Event
