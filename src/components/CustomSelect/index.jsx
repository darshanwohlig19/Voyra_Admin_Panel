import { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { useTheme } from '../../../../contexts/ThemeContext'

const CustomSelect = ({
  field,
  options,
  onChange,
  placeholderText = 'Select',
  isErrorField = false,
  value,
}) => {
  const lightStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    control: (provided) => ({
      ...provided,
      boxShadow: 'none', // Background color for options in dark theme
      background: 'transparent',
      color: '#fff', // Dark background color
      border: 'none', // Dark border
      width: '100%',
      padding: '0',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333', // Text color for selected value in light theme
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      background: state.isSelected
        ? '#007bff'
        : state.isFocused
        ? '#e9ecef'
        : 'white', // Background color for options in light theme
      color: state.isSelected ? '#fff' : '#333', // Text color for options in light theme
      ':hover': {
        background: '#007bff', // Hover background color in light theme
        color: '#fff', // Hover text color in light theme
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isErrorField === true ? '#f53939' : '#b1b5c4',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px', // Set a maximum height for the dropdown list to handle long lists
      overflowY: 'auto', // Add scrolling for long dropdowns
    }),
  }

  const darkStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
    control: (provided) => ({
      ...provided,
      boxShadow: 'none', // Background color for options in dark theme
      background: 'transparent',
      color: '#fff', // Dark background color
      border: 'none', // Dark border
      width: '100%',
      padding: '0',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff', // Text color for selected value in dark theme
    }),
    placeholder: (provided) => ({
      ...provided,
      color: isErrorField === true ? '#f87171' : '#b1b5c4',
    }),
    input: (provided) => ({
      ...provided,
      color: '#ffffff', // Text color for selected value in dark theme
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0',
      maxHeight: '200px',
      overflowY: 'auto', // Add scrolling for long dropdowns
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: 'pointer',
      background: state.isSelected
        ? '#7551ff'
        : state.isFocused
        ? '#666'
        : '#444', // Background color for options in dark theme
      color: state.isSelected ? '#fff' : '#fff', // Text color for options in dark theme
      ':hover': {
        background: '#7551ff', // Hover background color in dark theme
        color: '#fff', // Hover text color in dark theme
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 10,
    }),
  }
  const { darkmode } = useTheme()
  const [selectedStyle, setSelectedStyle] = useState(lightStyles)
  useEffect(() => {
    const selectedStyles =
      (localStorage?.darkMode !== 'false') === true ? darkStyles : lightStyles

    setSelectedStyle(selectedStyles)
  }, [darkmode])

  // Custom option component to handle divider
  const CustomOption = (props) => {
    const { data } = props
    if (data.divider) {
      return <div style={{ borderBottom: '1px solid #ccc', margin: '8px 0' }} />
    }
    return <components.Option {...props} />
  }

  return (
    <Select
      {...field}
      options={options}
      onChange={onChange}
      placeholder={placeholderText}
      styles={selectedStyle}
      value={value} // Default selection to the first option if no value is provided
      components={{ Option: CustomOption }}
      menuPortalTarget={document.body} // Ensures dropdown is appended to body and avoids overflow issues
    />
  )
}

export default CustomSelect
