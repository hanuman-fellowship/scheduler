import { ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white border-2 border-gray-400 shadow-lg min-w-96 max-w-lg mx-4">
        <fieldset className="p-4">
          <legend className="px-2 font-bold">{title}</legend>
          <div className="relative">
            {children}
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-1 text-gray-500 hover:text-gray-700"
              type="button"
            >
              ×
            </button>
          </div>
        </fieldset>
      </div>
    </div>
  )
}