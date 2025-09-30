import React, { useState, useEffect } from 'react'

/**
 * Renders a Typewriter component that displays a sequence of sentences with a typing effect.
 *
 * @param {Array<string>} sentences - An array of sentences to be displayed.
 * @return {JSX.Element} A React component that displays the current sentence being typed.
 */
const Typewriter = ({ sentences }) => {
  const [currentSentence, setCurrentSentence] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    let timerId
    const currentSentenceLength = sentences[currentIndex].length

    timerId = setInterval(() => {
      setCurrentSentence((prevSentence) => {
        if (prevSentence.length < currentSentenceLength) {
          return sentences[currentIndex].substring(0, prevSentence.length + 1)
        } else {
          // Move to the next sentence after fully typing the current one
          setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length)
          return ''
        }
      })
    }, 150) // Adjust the speed of the animation by changing this value

    return () => clearInterval(timerId)
  }, [currentIndex, sentences])

  return <div className="text-sm">{currentSentence}</div>
}

export default Typewriter
