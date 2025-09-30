import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import chroma from 'chroma-js'

/**
 * Renders a custom select component with support for multi-value selection.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.field - The field object.
 * @param {Array} props.options - The options for the select component.
 * @param {Function} props.onChange - The function to call when the select value changes.
 * @param {string} [props.placeholderText='Select'] - The placeholder text for the select component.
 * @param {boolean} [props.isErrorField=false] - Indicates if the select component is in an error state.
 * @param {Array} [props.value=[]] - The selected value(s) for the select component.
 * @param {boolean} props.isMultiValue - Indicates if the select component supports multi-value selection.
 * @return {JSX.Element} The rendered custom select component.
 */
const CustomSelect = ({
  field,
  options,
  onChange,
  placeholderText = 'Select',
  isErrorField = false,
  value = [],
  isMultiValue,
}) => {
  const [darkmode, setDarkMode] = useState(false)

  useEffect(() => {
    const darkmodeSetting = localStorage.getItem('darkMode')
    setDarkMode(darkmodeSetting === 'true')
  }, [])

  /**
   * Returns an object with styles for a dot element with a specified color.
   *
   * @param {string} [color='transparent'] - The color of the dot. Defaults to 'transparent'.
   * @return {Object} An object with styles for the dot element.
   */
  const dot = (color = 'transparent') => ({
    alignItems: 'center',
    display: 'flex',
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  })

  const handleStyles = {
    /**
     * A function that modifies the provided container with a width of '100%'.
     *
     * @param {Object} provided - The original container object.
     * @return {Object} The modified container object with width set to '100%'.
     */
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    /**
     * Generates the styles for the control element.
     *
     * @param {Object} provided - The original styles for the control element.
     * @return {Object} The modified styles for the control element.
     */
    control: (provided) => ({
      ...provided,
      boxShadow: 'none',
      background: 'transparent',
      color: darkmode ? '#fff' : '#333',
      border: darkmode ? '1px solid #fff' : 'none',
      borderRadius: '10px',
      width: '100%',
      padding: '0',
      '&:hover, &:focus, &:active': {
        border: darkmode ? '1px solid #fff' : 'none',
      },
    }),
    /**
     * Returns an object with styles for a multi-value element with a specified color.
     *
     * @param {Object} provided - The original multi-value object.
     * @param {Object} data - The data object containing the color property.
     * @return {Object} The modified multi-value object with styles.
     */
    multiValue: (provided, { data }) => ({
      ...provided,
      backgroundColor: darkmode
        ? data.color || '#7551ff'
        : data.color || '#007bff',
      padding: '2px 4px',
      borderRadius: '15px',
      display: 'flex',
      alignItems: 'center',
      margin: '2px',
    }),
    /**
     * A function that generates styles for a multi-value label element.
     *
     * @param {Object} provided - The original styles for the multi-value label.
     * @return {Object} The modified styles for the multi-value label.
     */
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#fff',
      padding: '0 6px',
    }),
    /**
     * Generates the styles for a multi-select option.
     *
     * @param {Object} styles - The original styles object.
     * @param {Object} options - The options object.
     * @param {Object} options.data - The data object.
     * @param {boolean} options.isDisabled - Indicates if the option is disabled.
     * @param {boolean} options.isFocused - Indicates if the option is focused.
     * @param {boolean} options.isSelected - Indicates if the option is selected.
     * @return {Object} The modified styles object.
     */
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color)
      return {
        ...styles,
        ...dot(data.color),
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : undefined,
        color: isDisabled ? '#ccc' : darkmode ? 'white' : 'black',
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? data.color
              : color.alpha(0.3).css()
            : undefined,
        },
      }
    },
    /**
     * Generates the styles for the placeholder element.
     *
     * @param {Object} provided - The original styles for the placeholder.
     * @return {Object} The modified styles for the placeholder.
     */
    placeholder: (provided) => ({
      ...provided,
      color: isErrorField ? '#f53939' : '#b1b5c4',
    }),
    /**
     * Generates the styles for the menu element.
     *
     * @param {Object} provided - The original styles for the menu.
     * @return {Object} The modified styles for the menu.
     */
    menu: (provided) => ({
      ...provided,
      backgroundColor: darkmode ? '#070f2e' : '#fff',
      zIndex: 10,
    }),
  }

  /**
   * A function that handles the change event when an option is selected.
   *
   * @param {type} selectedOption - description of the selected option
   * @return {type} description of what is returned
   */
  const handleChange = (selectedOption) => {
    onChange(selectedOption)
  }

  return (
    <Select
      {...field}
      options={options}
      onChange={handleChange}
      placeholder={placeholderText}
      styles={handleStyles}
      value={value}
      isMulti={isMultiValue}
    />
  )
}

export default CustomSelect
