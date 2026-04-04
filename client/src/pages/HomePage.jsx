import React from 'react'
import { useNavigate } from 'react-router-dom';
import oldStyleTrain from '../assets/videos/old_style_train.mp4'
import newStyleTrain from '../assets/videos/new_style_train.mp4'

export default function HomePage() {
  const navigate = useNavigate()
  const [activePanel, setActivePanel] = React.useState(null)
  const leftVideoRef = React.useRef(null)
  const rightVideoRef = React.useRef(null)

  const handlePanelHover = (panel) => {
    setActivePanel(panel)

    if (panel === 'left') {
      if (leftVideoRef.current) leftVideoRef.current.play()
      if (rightVideoRef.current) rightVideoRef.current.pause()
    } else if (panel === 'right') {
      if (rightVideoRef.current) rightVideoRef.current.play()
      if (leftVideoRef.current) leftVideoRef.current.pause()
    }
  }

  const handlePanelLeave = () => {
    if (leftVideoRef.current) leftVideoRef.current.pause()
    if (rightVideoRef.current) rightVideoRef.current.pause()
  }

  const handleLeftClick = () => navigate('/information')
  const handleRightClick = () => navigate('/metro-map')

  return (
    <div className="home-container">
      <div 
        className={`side-panel ${activePanel !== 'right' ? 'paused' : ''}`}
        onMouseEnter={() => handlePanelHover('left')}
        onMouseLeave={handlePanelLeave}
        // onClick={handleLeftClick}
      >
        <video 
          ref={leftVideoRef}
          muted
          loop
          src={oldStyleTrain}
        />
        <div className="side-label">Technology (3D)</div>
      </div>

      <div 
        className={`side-panel ${activePanel !== 'left' ? 'paused' : ''}`}
        onMouseEnter={() => handlePanelHover('right')}
        onMouseLeave={handlePanelLeave}
        onClick={handleRightClick}
      >
        <video 
          ref={rightVideoRef}
          muted
          loop
          src={newStyleTrain}
        />
        <div className="side-label">Heat Map</div>
      </div>
    </div>
  )
}
