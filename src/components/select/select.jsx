import React from 'react'
import Select, { components } from 'react-select'

// Custom styles for the select component
const customStyles = {
  control: (provided) => ({
    ...provided,
    border: 'none',
    boxShadow: 'none',
    padding: '0px',
  }),
  multiValue: (provided) => ({
    ...provided,
    borderRadius: '10px',
    padding: '0px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    borderRadius: '10px',
    padding: '4px 8px',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    borderRadius: '10px',
  }),
  menuList: (provided) => ({
    ...provided,
    padding: 0,
    maxHeight: '200px', // Adjust height if needed
    overflowY: 'auto',
    // Adding styles for slim scrollbar
    '&::-webkit-scrollbar': {
      width: '4px', // Slim scrollbar
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#F2D3DD', // Thumb color
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#F2D3DD', // Thumb color on hover
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#F2D3DD', // Track color
    },
  }),
}

const CustomSelectField = ({
  options,
  isMulti = false,
  isClearable = true,
  placeholder = 'Select...',
  value,
  onChange,
  isDisabled = false,
}) => {
  const handleChange = (selectedOptions) => {
    // Pass the updated selection back to the parent component
    onChange(selectedOptions)
  }

  return (
    <Select
      options={options}
      styles={customStyles}
      isMulti={isMulti}
      isClearable={isClearable}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      isDisabled={isDisabled}
      classNamePrefix="select"
      noOptionsMessage={() => 'Type to search...'}
      // components={{ Option: CustomOption }}
    />
  )
}

export default CustomSelectField
