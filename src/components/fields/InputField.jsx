import React from 'react'
/**
 * React component for an input field.
 *
 * @param {Object} props - the properties passed to the component
 * @return {JSX.Element} the input field component
 */
function InputField(props) {
  const {
    label,
    id,
    extra,
    type,
    placeholder,
    variant,
    state,
    disabled,
    noBorder,
    onClick,
    onChange,
    registrationProps,
    isFieldRequired,
    height,
    value,
    customClass,
    className,
  } = props

  /**
   * Handle input change event.
   *
   * @param {event} event - input change event
   * @return {void} no return value
   */
  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm  text-navy-700 dark:text-white ${
          variant === 'auth' ? 'ml-1.5 font-medium' : 'font-bold'
        }`}
      >
        {label} {isFieldRequired && <span className="text-red-500">*</span>}
      </label>
      <input
        onClick={onClick}
        onChange={onChange}
        disabled={disabled}
        type={type}
        style={{ height }}
        value={value}
        id={id}
        autoComplete="off"
        placeholder={placeholder}
        className={`mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${
          disabled === true
            ? '!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]'
            : state === 'error'
            ? 'border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400'
            : state === 'success'
            ? 'border-green-500 text-green-500 placeholder:text-green-500 dark:!border-green-400 dark:!text-green-400 dark:placeholder:!text-green-400'
            : 'border-gray-200 dark:!border-antiFlashWhite dark:text-white'
        } 
        ${noBorder ? 'w-11/12 border-none' : ''}
          ${customClass || ''}
          ${className || ''}
        `}
        {...registrationProps}
      />
    </div>
  )
}

export default InputField
