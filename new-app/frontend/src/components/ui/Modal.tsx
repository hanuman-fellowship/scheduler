import { ReactNode, useEffect, useRef, useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Additional actions section (like checkboxes) that appear above content */
  actions?: ReactNode
  /** Override default content styles */
  contentClassName?: string
  /** Make content scrollable (default: true) */
  scrollable?: boolean
  /** Wrap content in form element (default: true) */
  useForm?: boolean
}

/**
 * Scheduler3-style modal with dragging, smart positioning, and legacy visual styling
 * Matches the CakePHP scheduler3 popup design pixel-perfectly
 */
export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions,
  contentClassName,
  scrollable = true,
  useForm = true 
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Modal positioning
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const calculatePosition = () => {
    if (!modalRef.current) return { top: 100, left: 100 }
    
    const modal = modalRef.current
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const windowScrollTop = window.pageYOffset
    
    const modalWidth = modal.offsetWidth || 400
    const modalHeight = modal.offsetHeight || 300
    
    // Center by default
    let newLeft = (windowWidth / 2) - (modalWidth / 2)
    let newTop = (windowHeight / 2) - (modalHeight / 2) + windowScrollTop
    
    // Ensure modal stays within viewport bounds
    if (newLeft < 10) {
      newLeft = 10
    } else if (newLeft + modalWidth > windowWidth) {
      newLeft = windowWidth - modalWidth - 10
    }
    
    if (newTop < windowScrollTop + 10) {
      newTop = windowScrollTop + 10
    } else if (newTop + modalHeight > windowHeight + windowScrollTop) {
      newTop = windowHeight + windowScrollTop - modalHeight - 10
    }
    
    return { top: newTop, left: newLeft }
  }

  // Set initial position when modal opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const position = calculatePosition()
      setModalPosition(position)
    }
  }, [isOpen])

  // Handle window resize and scroll
  useEffect(() => {
    if (!isOpen) return

    const handleReposition = () => {
      if (!isDragging) {
        const position = calculatePosition()
        setModalPosition(position)
      }
    }

    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition)

    return () => {
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition)
    }
  }, [isOpen, isDragging])

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!modalRef.current) return
    
    setIsDragging(true)
    const rect = modalRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !modalRef.current) return
    
    const newLeft = e.clientX - dragOffset.x
    const newTop = e.clientY - dragOffset.y
    
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const modalWidth = modalRef.current.offsetWidth
    const modalHeight = modalRef.current.offsetHeight
    
    // Constrain to viewport
    const constrainedLeft = Math.max(10, Math.min(newLeft, windowWidth - modalWidth - 10))
    const constrainedTop = Math.max(10, Math.min(newTop, windowHeight - modalHeight - 10))
    
    setModalPosition({ left: constrainedLeft, top: constrainedTop })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, dragOffset])

  if (!isOpen) return null

  return (
    <>
      {/* Modal backdrop */}
      <div 
        className="fixed inset-0 z-50" 
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose()
          }
        }}
      />
      
      {/* Scheduler3-style popup */}
      <div
        ref={modalRef}
        className={`scheduler3-popup${isDragging ? ' dragging' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'absolute',
          top: modalPosition.top,
          left: modalPosition.left,
          zIndex: 101,
          padding: '0 2em 2em 2em',
          backgroundColor: '#d5f0ff', // lighten(#d0ecff, 5%)
          boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
          transition: isDragging ? 'none' : 'opacity 300ms ease-in-out',
          opacity: isDragging ? 0.7 : 1,
          userSelect: isDragging ? 'none' : 'auto'
        }}
      >
        {useForm ? (
          <form style={{ padding: '0 5px', overflow: 'hidden', minWidth: '400px' }}>
            {/* Header - draggable */}
            <div 
              className="heading"
              style={{
                textAlign: 'center',
                fontSize: '1.5em',
                marginTop: '0.5em',
                paddingBottom: '0.3em',
                borderBottom: '1px solid rgba(0, 0, 0, .5)',
                fontFamily: 'times, serif',
                cursor: 'move'
              }}
              onMouseDown={handleMouseDown}
            >
              {title}
            </div>

            {/* Actions section (optional) */}
            {actions && (
              <div 
                className="actions"
                style={{
                  margin: '0.5em 0',
                  borderBottom: '1px solid rgba(0, 0, 0, .5)',
                  paddingBottom: '0.2em'
                }}
              >
                {actions}
              </div>
            )}

            {/* Content section */}
            <div
              className={`content ${contentClassName || ''}`}
              style={{
                marginTop: '1em',
                ...(scrollable && {
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  maxHeight: '65vh'
                })
              }}
            >
              {children}
            </div>
          </form>
        ) : (
          <div style={{ padding: '0 5px', overflow: 'hidden', minWidth: '400px' }}>
            {/* Header - draggable */}
            <div 
              className="heading"
              style={{
                textAlign: 'center',
                fontSize: '1.5em',
                marginTop: '0.5em',
                paddingBottom: '0.3em',
                borderBottom: '1px solid rgba(0, 0, 0, .5)',
                fontFamily: 'times, serif',
                cursor: 'move'
              }}
              onMouseDown={handleMouseDown}
            >
              {title}
            </div>

            {/* Actions section (optional) */}
            {actions && (
              <div 
                className="actions"
                style={{
                  margin: '0.5em 0',
                  borderBottom: '1px solid rgba(0, 0, 0, .5)',
                  paddingBottom: '0.2em'
                }}
              >
                {actions}
              </div>
            )}

            {/* Content section */}
            <div
              className={`content ${contentClassName || ''}`}
              style={{
                marginTop: '1em',
                ...(scrollable && {
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  maxHeight: '65vh'
                })
              }}
            >
              {children}
            </div>
          </div>
        )}
      </div>
    </>
  )
}