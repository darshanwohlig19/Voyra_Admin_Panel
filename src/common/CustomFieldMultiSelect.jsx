import React, { useEffect, useState } from 'react'
import Select, { components } from 'react-select'

const CustomFieldSelect = ({
  field,
  options,
  onChange,
  placeholderText = 'Select',
  isErrorField = false,
  value = [],
  isMultiValue,
}) => {
  const [darkmode, setDarkMode] = useState(false)
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  useEffect(() => {
    const darkmodeSetting = localStorage.getItem('darkMode')
    setDarkMode(darkmodeSetting === 'true')
  }, [localStorage.getItem('darkMode')])

  const isAllSelected =
    options.length > 0 && value.length > 0 && value.length === options.length

  const commonStyles = {
    container: (provided) => ({
      ...provided,
      width: '100%',
    }),
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
    placeholder: (provided) => ({
      ...provided,
      color: isErrorField ? '#f53939' : '#b1b5c4',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: darkmode ? '#444' : '#fff',
      zIndex: 10,
    }),
  }

  const darkStyles = {
    ...commonStyles,
    multiValue: (provided) => ({
      ...provided,
      display: 'none', // Hide selected value pills
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected
        ? '#7551ff'
        : state.isFocused
          ? '#666'
          : '#444', // Background for dark theme
      color: '#fff',
      ':hover': {
        background: '#7551ff',
        color: '#fff',
      },
    }),
  }

  const lightStyles = {
    ...commonStyles,
    multiValue: (provided) => ({
      ...provided,
      display: 'none', // Hide selected value pills
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isSelected
        ? '#007bff'
        : state.isFocused
          ? '#e9ecef'
          : 'white', // Background for light theme
      color: state.isSelected ? '#fff' : '#333',
      ':hover': {
        background: '#007bff',
        color: '#fff',
      },
    }),
  }

  const selectedStyle = darkmode ? darkStyles : lightStyles

  const handleChange = (selectedOption) => {
    onChange(selectedOption || [])
    setMenuIsOpen(true)
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      onChange([])
    } else if (options.length > 0) {
      onChange(options)
    }
    setMenuIsOpen(false)
  }

  const SelectAllOption = () => (
    <div className="select-all-option">
      <input
        type="checkbox"
        checked={isAllSelected}
        onChange={handleSelectAll}
        disabled={options.length === 0}
      />
      <label className="ml-2">Select All</label>
    </div>
  )

  const MultiValueOption = ({ data, removeProps }) => (
    <div className="multi-value-option">
      <span>{data.label}</span>
      <button
        {...removeProps}
        style={{
          background: 'transparent',
          border: 'none',
          color: darkmode ? '#fff' : '#333',
        }}
      >
        ×
      </button>
    </div>
  )

  return (
    <Select
      {...field}
      options={options}
      onChange={handleChange}
      menuIsOpen={menuIsOpen}
      onMenuOpen={() => setMenuIsOpen(true)}
      onMenuClose={() => setMenuIsOpen(false)}
      placeholder={placeholderText}
      styles={selectedStyle}
      value={value}
      isMulti={isMultiValue}
      components={{
        ClearIndicator: () => null,
        MenuList: (props) => (
          <>
            <SelectAllOption />
            <components.MenuList {...props} />
          </>
        ),
        MultiValue: MultiValueOption, // Custom rendering of selected items
      }}
    />
  )
}

export default CustomFieldSelect
