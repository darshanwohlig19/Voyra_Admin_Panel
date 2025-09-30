import Radio from 'components/radio'
/**
 * Renders a button component for the header links.
 *
 * @param {object} props - The props object containing the following properties:
 *   - onClick: The click event handler for the button.
 *   - active: A boolean indicating whether the button is active or not.
 *   - label: The label to be displayed on the button.
 *   - children: The child components to be rendered inside the button.
 * @return {JSX.Element} The rendered button component.
 */
export default function HeaderLinks(props) {
  return (
    <button
      onClick={props.onClick}
      className={`flex h-max w-full flex-col rounded-2xl border-[1px] border-gray-200 px-3 py-3 hover:bg-white hover:shadow-[0px_18px_40px_rgba(112,_144,_176,_0.22)] 
      focus:bg-white focus:shadow-[0px_18px_40px_rgba(112,_144,_176,_0.22)] active:bg-[#F7F9FF] active:shadow-[0px_18px_40px_rgba(112,_144,_176,_0.22)]
      dark:border-white/20 dark:hover:bg-navy-700 dark:hover:shadow-[unset] dark:focus:bg-navy-700
      dark:focus:shadow-[unset] dark:active:bg-white/10 dark:active:shadow-[unset] ${
        props.active ? 'bg-white dark:bg-navy-700' : 'bg-[transparent]'
      } ${
        props.active
          ? 'shadow-[0px_18px_40px_rgba(112,_144,_176,_0.22)] dark:shadow-[unset]'
          : 'bg-[transparent]'
      } `}
    >
      <div className="flex w-full justify-between">
        {props.label}
        <Radio checked={props.active} />
      </div>
      {props.children}
    </button>
  )
}
