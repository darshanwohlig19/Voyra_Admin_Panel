/**
 * Creates a Card component with the specified variant, extra, children, and additional props.
 *
 * @param {Object} props - The properties for the Card component
 * @return {JSX.Element} The Card component
 */
function Card(props) {
  const { variant, extra, children, ...rest } = props
  return (
    <div
      className={`!z-5 relative flex flex-col  bg-white bg-clip-border shadow-3xl dark:!bg-darkGrayishBlue ${
        props.default
          ? 'shadow-shadow-500 dark:shadow-none'
          : 'shadow-shadow-100 dark:shadow-none'
      }  dark:!bg-darkGrayishBlue dark:text-white  ${extra}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card
