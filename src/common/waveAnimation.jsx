import React from 'react'

const WavyLines = () => {
  const numberOfLines = 20 // Adjust the number of lines
  const amplitude = 50 // Adjust the wave amplitude
  const frequency = 0.1 // Adjust the wave frequency
  const offset = 0 // You can animate this for a dynamic effect

  const generatePoints = (y) => {
    const points = []
    for (let x = 0; x <= 100; x += 1) {
      // Adjust the density of points
      const adjustedY = y + amplitude * Math.sin(frequency * x + offset)
      points.push(`${x},${adjustedY}`)
    }
    return points.join(' ')
  }

  const lines = Array.from({ length: numberOfLines }, (_, i) => {
    const yStart = i * 10 // Adjust spacing between lines
    return (
      <polyline
        key={i}
        points={generatePoints(yStart)}
        fill="none"
        stroke="white" // Adjust line color
        strokeWidth={2} // Adjust line thickness
      />
    )
  })

  return (
    <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
      {lines}
    </svg>
  )
}

export default WavyLines
