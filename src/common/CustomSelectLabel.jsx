import React, { useState, useEffect, useRef } from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs'

const MultiSelectDropdown = ({
  options,
  selectedValues,
  setSelectedValues,
}) => {
  const [filterInput, setFilterInput] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const darkModeSetting = localStorage.getItem('darkMode')
    setDarkMode(darkModeSetting === 'true')
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  // Function to handle selection of options
  const handleSelect = (option) => {
    const optionValue = option.value
    if (selectedValues.includes(optionValue)) {
      setSelectedValues(
        selectedValues?.filter((value) => value !== optionValue)
      )
    } else {
      setSelectedValues([...selectedValues, optionValue])
    }
  }

  // Function to handle filtering input
  const handleFilterChange = (event) => {
    setFilterInput(event.target.value)
    setDropdownOpen(true) // Open dropdown on filter change
  }

  // Function to toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  // Function to filter and sort options based on filterInput and selected values
  const filteredOptions = options
    .filter((option) =>
      option.label.toLowerCase()?.includes(filterInput?.toLowerCase())
    )
    .sort((a, b) => {
      const aSelected = selectedValues.includes(a.value)
      const bSelected = selectedValues.includes(b.value)
      if (aSelected && !bSelected) return -1
      if (!aSelected && bSelected) return 1
      return 0
    })

  return (
    <div className="multi-select-dropdown" ref={dropdownRef}>
      <div>
        <input
          type="text"
          value={filterInput}
          onChange={handleFilterChange}
          onClick={toggleDropdown}
          autoComplete="off"
          placeholder="Labels"
          className="w-[200px] rounded-2xl border border-gray-200 bg-white p-3 outline-none dark:border dark:!border-antiFlashWhite dark:!bg-navy-800 dark:text-white"
        />
        {dropdownOpen && (
          <div
            className={
              darkMode
                ? 'darkmode-dropdown-options rounded-md'
                : 'dropdown-options rounded-md'
            }
          >
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`flex cursor-pointer items-center px-3 py-1 ${
                  darkMode ? 'darkMode-option' : 'option'
                } ${
                  selectedValues.includes(option.value)
                    ? darkMode
                      ? 'darkMode-selected'
                      : 'selected'
                    : ''
                }`}
                onClick={() => handleSelect(option)}
              >
                <span
                  className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                {option.label}
                {selectedValues.includes(option.value) && (
                  <BsFillCheckCircleFill className="selected-icon" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiSelectDropdown
