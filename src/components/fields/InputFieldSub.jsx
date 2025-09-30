// Custom components
import React from 'react'

/**
 * Renders an input field component with label, sublabel, id, extra, type, placeholder, variant, state, disabled, and registrationProps.
 *
 * @param {object} props - The props object containing all the necessary properties for the input field.
 * @return {JSX.Element} The input field component to be rendered.
 */
function InputFieldSub(props) {
  const {
    label,
    sublabel,
    id,
    extra,
    type,
    placeholder,
    variant,
    state,
    disabled,
    registrationProps,
    isFieldRequired,
    value,
  } = props

  const handleKeyPress = (e) => {
    // Prevent input of spaces
    if (e.key === ' ' && !['schedule', 'command'].includes(e.target.id)) {
      e.preventDefault()
    }
  }

  return (
    <div
      className={`gird col-span-12 items-center md:col-span-12 md:flex ${extra}`}
    >
      <div className="mr-3 flex-shrink-0 text-left md:w-1/3">
        <label
          htmlFor={id}
          className={`text-sm text-navy-700 dark:text-white ${
            variant === 'auth' ? 'ml-1.5 font-medium' : 'font-bold'
          }`}
        >
          {label} {isFieldRequired && <span className="text-red-500">*</span>}
        </label>
        <div className="text-xs">{sublabel}</div>
      </div>
      <input
        disabled={disabled}
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
          disabled === true
            ? '!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]'
            : state === 'error'
            ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
            : state === 'success'
            ? 'border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400'
            : 'border-gray-200 dark:!border-antiFlashWhite dark:text-white'
        }`}
        {...registrationProps}
        onKeyPress={handleKeyPress}
      />
    </div>
  )
}

export default InputFieldSub
