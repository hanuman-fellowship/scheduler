import { ReactNode, useEffect, useRef, useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const computeCenteredPosition = (): { top: number; left: number } => {
    if (typeof window === 'undefined') return { top: 16, left: 16 }
    const estimatedWidth = Math.min(window.innerWidth - 32, 640)
    const estimatedHeight = Math.min(window.innerHeight - 32, 400)
    const top = Math.max(16, Math.round((window.innerHeight - estimatedHeight) / 2))
    const left = Math.max(16, Math.round((window.innerWidth - estimatedWidth) / 2))
    return { top, left }
  }
  const [position, setPosition] = useState<{ top: number; left: number }>(() => computeCenteredPosition())
  const dragStateRef = useRef<{ isDragging: boolean; offsetX: number; offsetY: number }>({ isDragging: false, offsetX: 0, offsetY: 0 })

  useEffect(() => {
    if (!isOpen) return
    // Re-center once on open in case viewport changed since last render
    setPosition(computeCenteredPosition())
  }, [isOpen])

  // Handlers created once to avoid re-adding on every render
  const updatePosition = (clientX: number, clientY: number) => {
    const nextTop = clientY - dragStateRef.current.offsetY
    const nextLeft = clientX - dragStateRef.current.offsetX
    const panel = panelRef.current
    const rect = panel?.getBoundingClientRect()
    const maxTop = window.innerHeight - (rect?.height ?? 0) - 16
    const maxLeft = window.innerWidth - (rect?.width ?? 0) - 16
    setPosition({
      top: Math.min(Math.max(16, nextTop), Math.max(16, maxTop)),
      left: Math.min(Math.max(16, nextLeft), Math.max(16, maxLeft))
    })
  }
  const handlePointerMove = (e: PointerEvent) => {
    if (!dragStateRef.current.isDragging) return
    e.preventDefault()
    updatePosition(e.clientX, e.clientY)
  }
  const handlePointerUp = () => {
    dragStateRef.current.isDragging = false
    document.body.style.userSelect = ''
    document.removeEventListener('pointermove', handlePointerMove)
    document.removeEventListener('pointerup', handlePointerUp)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  const handleMouseMove = (e: MouseEvent) => {
    if (!dragStateRef.current.isDragging) return
    e.preventDefault()
    updatePosition(e.clientX, e.clientY)
  }
  const handleMouseUp = () => {
    handlePointerUp()
  }

  if (!isOpen) return null

  const startDrag = (clientX: number, clientY: number) => {
    const panel = panelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    dragStateRef.current = {
      isDragging: true,
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
    }
    document.body.style.userSelect = 'none'
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerup', handlePointerUp)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  const onHeaderPointerDown = (e: React.PointerEvent) => {
    startDrag(e.clientX, e.clientY)
    try { (e.currentTarget as any).setPointerCapture?.(e.pointerId) } catch {}
  }
  const onHeaderMouseDown = (e: React.MouseEvent) => {
    startDrag(e.clientX, e.clientY)
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop (no blur) */}
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
      />

      {/* Modal panel (draggable) */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed z-10 w-full max-w-lg"
        style={{ top: position.top, left: position.left }}
      >
        <div className="relative w-full bg-white rounded-xl shadow-2xl ring-1 ring-black/10">
          <div className="px-6 pt-4 pb-3 cursor-move select-none" onPointerDown={onHeaderPointerDown} onMouseDown={onHeaderMouseDown}>
            <h2 className="text-xl font-semibold leading-6 text-gray-900">{title}</h2>
          </div>
          <div className="px-6 pb-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}