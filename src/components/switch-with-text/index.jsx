/**
 * Renders a switch component with text on either side.
 *
 * @param {Object} props - The properties for the SwitchWithText component.
 * @param {string} props.textLeft - The text to display on the left side of the switch.
 * @param {string} props.textRight - The text to display on the right side of the switch.
 * @param {boolean} props.checked - The current checked state of the switch.
 * @param {function} props.onChange - The event handler function to be called when the switch state changes.
 * @param {string} [props.extraClass] - An optional additional CSS class to apply to the switch component.
 * @return {JSX.Element} The rendered SwitchWithText component.
 */
const SwitchWithText = ({
  textLeft,
  textRight,
  checked,
  onChange,
  extraClass,
}) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        value=""
        checked={checked}
        className="peer sr-only"
        onChange={onChange}
      />
      <div
        className={`dark:border-slate-600 peer flex h-8 w-full items-center gap-6 rounded-full bg-horizonPurple-900 px-4 text-sm after:absolute after:h-6 after:w-16 after:-translate-x-3 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:left-2 peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-gray-800 ${extraClass}
        ${
          checked
            ? '[&>span.text-left]:text-white [&>span.text-right]:text-blueSecondary'
            : '[&>span.text-left]:text-blueSecondary [&>span.text-right]:text-white'
        }`}
      >
        <span className="z-10 text-left">{textLeft}</span>
        <span className="z-10 text-right">{textRight}</span>
      </div>
    </label>
  )
}

export default SwitchWithText
