import React from 'react'

/**
 * Function to render the track element with specified styles.
 *
 * @param {object} style - The style object for custom styling.
 * @param {...any} props - Additional props to spread.
 * @return {JSX.Element} The rendered track element.
 */
export const renderTrack = ({ style, ...props }) => {
  const trackStyle = {
    position: 'absolute',
    maxWidth: '100%',
    width: 6,
    transition: 'opacity 200ms ease 0s',
    opacity: 0,
    background: 'transparent',
    bottom: 2,
    top: 2,
    borderRadius: 3,
    right: 0,
  }
  return <div style={{ ...style, ...trackStyle }} {...props} />
}
/**
 * Renders a thumb element with specified styles.
 *
 * @param {object} style - The style object for custom styling.
 * @param {...any} props - Additional props to spread.
 * @return {JSX.Element} The rendered thumb element.
 */
export const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 15,
    background: 'rgba(222, 222, 222, .1)',
  }
  return <div style={{ ...style, ...thumbStyle }} {...props} />
}
/**
 * Renders a view component with specified styles and props.
 *
 * @param {Object} props - The props object containing the style and other props.
 * @return {JSX.Element} The rendered view component.
 */
export const renderView = ({ style, ...props }) => {
  const viewStyle = {
    position: 'absolute',
    inset: 0,
    overflow: 'scroll',
    marginBottom: '-15px',
    borderRadius: '2rem',
  }
  return (
    <div
      me={{ base: '0px !important', md: '-16px !important' }}
      style={{ ...style, ...viewStyle }}
      {...props}
    />
  )
}
/**
 * Renders a view component with specified styles and props.
 *
 * @param {Object} props - The props object containing the style and other props.
 * @return {JSX.Element} The rendered view component.
 */
export const renderViewMini = ({ style, ...props }) => {
  const viewStyle = {}
  return (
    <div
      me={{ base: '0px !important', md: '-16px !important' }}
      style={{ ...style, ...viewStyle }}
      {...props}
    />
  )
}

/**
 * Renders the track element with specified styles and props for messages.
 *
 * @param {object} style - The style object for custom styling.
 * @param {...any} props - Additional props to spread.
 * @return {JSX.Element} The rendered track element.
 */
export const renderTrackMessages = ({ style, ...props }) => {
  const trackStyle = {
    position: 'absolute',
    maxWidth: '100%',
    width: 6,
    transition: 'opacity 200ms ease 0s',
    opacity: 0,
    background: 'transparent',
    bottom: -10,
    borderRadius: 3,
    right: '-10px',
  }
  return <div style={{ ...style, ...trackStyle }} {...props} />
}
/**
 * Renders a thumb element with specified styles and props for messages.
 *
 * @param {object} style - The style object for custom styling.
 * @param {...any} props - Additional props to spread.
 * @return {JSX.Element} The rendered thumb element.
 */
export const renderThumbMessages = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 15,
    background: 'rgba(222, 222, 222, .1)',
  }
  return <div style={{ ...style, ...thumbStyle }} {...props} />
}
/**
 * Renders a view component with a specific style and props.
 *
 * @param {Object} param - An object containing the style and props.
 * @param {Object} param.style - The style object to be applied to the view.
 * @param {Object} param.props - The props to be passed to the view.
 * @return {JSX.Element} - The rendered view component.
 */
export const renderViewMessages = ({ style, ...props }) => {
  const viewStyle = {
    innerHeight: '100%',
    height: '100%',
    overflowX: 'visible',
  }
  return <div style={{ ...style, ...viewStyle }} {...props} />
}

/**
 * Renders a track element for the Kanban component.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.style - The style object.
 * @return {JSX.Element} The rendered track element.
 */
export const kanbanRenderTrack = ({ style, ...props }) => {
  const trackStyle = {
    width: 6,
    transition: 'opacity 200ms ease 0s',
    opacity: 0,
    bottom: 2,
    top: 2,
    borderRadius: 3,
    right: 0,
  }
  return <div style={{ ...style, ...trackStyle }} {...props} />
}
/**
 * Renders a thumb element for the Kanban component.
 *
 * @param {Object} props - The props object.
 * @param {Object} props.style - The style object.
 * @return {JSX.Element} The rendered thumb element.
 */
export const kanbanRenderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 15,
    background: 'rgba(222, 222, 222, .1)',
  }
  return <div style={{ ...style, ...thumbStyle }} {...props} />
}
/**
 * Renders a view component with specified styles and props.
 *
 * @param {Object} style - The style object to be applied to the view.
 * @param {Object} props - The props to be passed to the view.
 * @return {JSX.Element} - The rendered view component.
 */
export const kanbanRenderView = ({ style, ...props }) => {
  const viewStyle = {
    position: 'relative',
    marginRight: -15,
  }
  return <div style={{ ...style, ...viewStyle }} {...props} />
}

/**
 * Renders a track element for the stories component.
 *
 * @param {Object} style - The style object.
 * @param {...any} props - Additional props to spread.
 * @return {JSX.Element} The rendered track element.
 */
export const storiesRenderTrack = ({ style, ...props }) => {
  const trackStyle = {
    width: 6,
    transition: 'opacity 200ms ease 0s',
    opacity: 0,
    bottom: 2,
    top: 2,
    borderRadius: 3,
    right: 0,
  }
  return <div style={{ ...style, ...trackStyle }} {...props} />
}
/**
 * Renders a thumb element for the stories component.
 *
 * @param {Object} style - The style object.
 * @param {...any} props - Additional props to spread.
 * @return {JSX.Element} The rendered thumb element.
 */
export const storiesRenderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 15,
    background: 'rgba(222, 222, 222, .1)',
  }
  return <div style={{ ...style, ...thumbStyle }} {...props} />
}
/**
 * Renders a view component with specified styles and props.
 *
 * @param {Object} style - The style object to be applied to the view.
 * @param {Object} props - The props to be passed to the view.
 * @return {JSX.Element} - The rendered view component.
 */
export const storiesRenderView = ({ style, ...props }) => {
  const viewStyle = {
    position: 'relative',
    marginRight: -15,
  }
  return <div style={{ ...style, ...viewStyle }} {...props} />
}
