import { Tooltip } from '@chakra-ui/tooltip'
/**
 * Function component for rendering a tooltip with specified content and trigger.
 *
 * @param {object} props - Object containing extra, trigger, content, and placement properties
 * @return {JSX.Element} Rendered tooltip component
 */
const TooltipHorizon = (props) => {
  const { extra, trigger, content, placement } = props
  return (
    <Tooltip
      placement={placement}
      label={content}
      className={`w-max rounded-xl bg-white px-4 py-3 text-sm shadow-xl shadow-shadow-500 dark:bg-darkGrayishBlue dark:text-white dark:shadow-none ${extra}`}
    >
      {trigger}
    </Tooltip>
  )
}

export default TooltipHorizon
