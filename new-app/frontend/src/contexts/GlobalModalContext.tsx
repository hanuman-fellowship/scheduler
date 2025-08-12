import { createContext, useContext, useState, ReactNode } from 'react'
import Modal from '../components/ui/Modal'
import AddShiftForm from '../components/shifts/AddShiftForm'
import AddPersonForm from '../components/people/AddPersonForm'
import AddCategoryForm from '../components/people/AddCategoryForm'
import AddAreaForm from '../components/areas/AddAreaForm'

type ModalType = 'shift' | 'person' | 'category' | 'area' | null

interface GlobalModalContextType {
  openModal: (type: ModalType) => void
  closeModal: () => void
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined)

export function GlobalModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const openModal = (type: ModalType) => {
    setActiveModal(type)
  }

  const closeModal = () => {
    setActiveModal(null)
  }

  return (
    <GlobalModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Shift Modal */}
      <Modal
        isOpen={activeModal === 'shift'}
        onClose={closeModal}
        title="New Shift"
      >
        <AddShiftForm
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>

      {/* Person Modal */}
      <Modal
        isOpen={activeModal === 'person'}
        onClose={closeModal}
        title="Add Person"
      >
        <AddPersonForm
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>

      {/* Category Modal */}
      <Modal
        isOpen={activeModal === 'category'}
        onClose={closeModal}
        title="New Resident Category"
      >
        <AddCategoryForm
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>

      {/* Area Modal */}
      <Modal
        isOpen={activeModal === 'area'}
        onClose={closeModal}
        title="Add Area"
      >
        <AddAreaForm
          onSuccess={closeModal}
          onCancel={closeModal}
        />
      </Modal>
    </GlobalModalContext.Provider>
  )
}

export function useGlobalModal() {
  const context = useContext(GlobalModalContext)
  if (context === undefined) {
    throw new Error('useGlobalModal must be used within a GlobalModalProvider')
  }
  return context
}