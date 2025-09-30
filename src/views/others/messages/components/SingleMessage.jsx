import React from 'react'

function SingleMessage(props) {
  const {
    message,
    time,
    extra,
    text,
    timecolor,
    image,
    profileImg,
    userType,
    clearMessages,
    receivedData,
  } = props

  const messageContainerClass = userType === 'user' ? 'flex-row-reverse' : ''
  const profileImageClass = userType === 'user' ? 'rounded-full ml-4' : ''

  /**
   * Clears the messages by calling the `clearMessages` function.
   *
   * @return {void}
   */
  const handleClick = () => {
    clearMessages()
  }

  return (
    <>
      <div className={`mb-4 flex items-center ${messageContainerClass}`}>
        <img
          src={image}
          alt="image"
          className={`mr-4 h-12 w-12 rounded-full ${profileImageClass}`}
        />
        <div className={`rounded-lg p-3 shadow-md ${extra}`}>
          <p className={`${text}`}>{message}</p>
          <span className={`mt-1 text-xs ${timecolor}`}>{time}</span>
        </div>
      </div>
    </>
  )
}

export default SingleMessage
