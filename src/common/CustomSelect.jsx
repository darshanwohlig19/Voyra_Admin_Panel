import React, { useEffect, useState } from 'react'
import Select, { components } from 'react-select'
import { useTheme } from '../contexts/ThemeContext'

const CustomSelect = React.forwardRef(
  (
    {
      field,
      options,
      onChange,
      placeholderText = 'Select',
      isErrorField = false,
      isDisabled = false,
      value,
      className,
      isMulti = false,
    },
    ref
  ) => {
    const lightStyles = {
      container: (provided) => ({
        ...provided,
        width: '100%',
      }),
      control: (provided) => ({
        ...provided,
        background: isDisabled ? 'transparent' : 'transparent', // Lighter background for disabled
        boxShadow: 'none',
        color: '#fff',
        border: 'none',
        width: '100%',
        padding: '0',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }),
      singleValue: (provided) => ({
        ...provided,
        color: isDisabled ? '#b1b1b1' : '#1E0627',
      }),
      option: (provided, state) => ({
        ...provided,
        background: state.isSelected
          ? '#007bff'
          : state.isFocused
            ? '#e9ecef'
            : 'white',
        color: state.isSelected ? '#fff' : '#333',
        ':hover': {
          background: '#007bff',
          color: '#fff',
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
        padding: '0',
        maxHeight: '200px', // Set a max height for the dropdown
        overflowY: 'auto', // Enable vertical scrolling
        scrollbarWidth: 'thin', // Firefox: Make the scrollbar thin
        WebkitOverflowScrolling: 'touch', // Enable smooth scrolling for iOS
      }),
    }

    const darkStyles = {
      container: (provided) => ({
        ...provided,
        width: '100%',
      }),
      control: (provided) => ({
        ...provided,
        boxShadow: 'none',
        background: 'transparent',
        color: '#b1b1b1',
        border: 'none',
        width: '100%',
        padding: '0',
      }),
      singleValue: (provided) => ({
        ...provided,
        color: '#b1b1b1',
      }),
      placeholder: (provided) => ({
        ...provided,
        color: isErrorField === true ? '#f87171' : '#b1b5c4',
      }),
      input: (provided) => ({
        ...provided,
        color: '#b1b1b1',
      }),
      menuList: (provided) => ({
        ...provided,
        padding: '0',
        maxHeight: '200px', // Set a max height for the dropdown
        overflowY: 'auto', // Enable vertical scrolling
        scrollbarWidth: 'thin', // Firefox: Make the scrollbar thin
        WebkitOverflowScrolling: 'touch', // Enable smooth scrolling for iOS
        // Custom thin scrollbar for webkit browsers (Chrome, Safari)
        '&::-webkit-scrollbar': {
          width: '4px', // Make the scrollbar very thin
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888', // Set the color of the thumb
          borderRadius: '10px', // Round the thumb for a better look
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent', // Hide the track
        },
      }),
    }

    const { darkmode } = useTheme()
    const [selectedStyle, SetSelectedStyle] = useState(lightStyles)

    useEffect(() => {
      const selectedStyles =
        (localStorage?.darkMode !== 'false') === true ? darkStyles : lightStyles

      SetSelectedStyle(selectedStyles)
      //eslint-disable-next-line
    }, [darkmode])

    const CustomOption = (props) => {
      const { data } = props
      if (data.divider) {
        return (
          <div style={{ borderBottom: '1px solid #ccc', margin: '8px 0' }} />
        )
      }
      return <components.Option {...props} />
    }

    return (
      <Select
        {...field}
        ref={ref}
        options={options}
        onChange={onChange}
        placeholder={placeholderText}
        styles={selectedStyle}
        value={value}
        components={{ Option: CustomOption }}
        isDisabled={isDisabled}
        className={className}
        isMulti={isMulti}
      />
    )
  }
)

export default CustomSelect
