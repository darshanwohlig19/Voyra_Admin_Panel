// Custom components
import React, { useState } from 'react'
import { MdClose } from 'react-icons/md'

/**
 * Renders a tags field component.
 *
 * @param {object} props - The properties for the component.
 * @return {JSX.Element} The rendered tags field component.
 */
function TagsField(props) {
  const { label, id, placeholderTags, placeholder, ...rest } = props
  let initialTags = [
    {
      name: 'chakra-ui',
      id: 1,
    },
    {
      name: 'react',
      id: 2,
    },
    {
      name: 'javascript',
      id: 3,
    },
  ]
  if (placeholderTags) initialTags = placeholderTags
  const [tags, setTags] = useState(initialTags)

  /**
   * Handles the key press event and adds a new tag when the Enter key is pressed.
   *
   * @param {Event} e - the key press event object
   */
  const keyPress = (e) => {
    if (e.keyCode === 13) {
      setTags([
        ...tags,
        {
          name: e.target.value,
          id: tags.length === 0 ? 1 : tags[tags.length - 1].id + 1,
        },
      ])
      e.target.value = ''
    }
  }

  return (
    <div>
      <label for={id} className={'mb-2 text-sm font-bold'}>
        {label}
      </label>
      <div
        className="h-stretch flex min-h-10 flex-row flex-wrap rounded-xl border border-gray-200 bg-none p-3 focus:border-brand-200 dark:!border-antiFlashWhite"
        {...rest}
      >
        {tags.map((tag, index) => {
          return (
            <div
              className="align-center mb-1.5 mr-1.5 flex items-center rounded-xl bg-brand-500 px-3 py-0.5 text-sm font-medium"
              key={index}
            >
              <p className="mr-1 w-full text-white">{tag.name}</p>
              <MdClose
                className="justify-end text-white"
                onClick={() =>
                  setTags([...tags.filter((element) => element.id !== tag.id)])
                }
              />
            </div>
          )
        })}
        <input
          type="text"
          onKeyDown={(e) => keyPress(e)}
          id="username"
          placeholder={placeholder}
          className="flex h-[48px] w-full border-none bg-none p-0 text-sm outline-none dark:!bg-navy-800"
        />
      </div>
    </div>
  )
}

export default TagsField
