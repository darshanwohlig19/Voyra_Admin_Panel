import { Popover, PopoverTrigger, PopoverContent } from '@chakra-ui/popover'
/**
 * Create a Popover component with the given trigger and content, along with any extra styling.
 *
 * @param {object} props - The properties object containing extra, trigger, and content.
 * @return {JSX.Element} The Popover component.
 */
const PopoverHorizon = (props) => {
  const { extra, trigger, content } = props
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent
        className={`w-max rounded-xl bg-white px-4 py-3 text-sm shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none ${extra}`}
      >
        {content}
      </PopoverContent>
    </Popover>
  )
}

export default PopoverHorizon
