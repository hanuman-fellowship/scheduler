import { createContext, useContext, useState, ReactNode } from 'react'
import Modal from '../components/ui/Modal'
import AddShiftForm from '../components/shifts/AddShiftForm'
import AddPersonForm from '../components/people/AddPersonForm'
import AddCategoryForm from '../components/people/AddCategoryForm'
import AddAreaForm from '../components/areas/AddAreaForm'
import { AreaSelectionContent } from '../components/schedules/AreaSelectionContent'
import { PersonSelectionContent } from '../components/schedules/PersonSelectionContent'
import EditCategoryForm from '../components/categories/EditCategoryForm'
import DeleteCategoryModal from '../components/categories/DeleteCategoryModal'
import { InProgressScheduleSelection } from '../components/schedules/InProgressScheduleSelection'
import { PublishedScheduleSelection } from '../components/schedules/PublishedScheduleSelection'

type ModalType = 'shift' | 'person' | 'category' | 'area' | 'areaSelection' | 'personSelection' | 'editCategory' | 'deleteCategory' | 'inProgressSchedules' | 'publishedSchedules' | null

interface Category {
  id: number
  name: string
  color: string
}

interface GlobalModalContextType {
  openModal: (type: ModalType, data?: any) => void
  closeModal: () => void
  openAreaSelectionModal: () => void
  openPersonSelectionModal: () => void
  openEditCategoryModal: (category: Category) => void
  openDeleteCategoryModal: (category: Category) => void
  openInProgressSchedulesModal: () => void
  openPublishedSchedulesModal: () => void
}

const GlobalModalContext = createContext<GlobalModalContextType | undefined>(undefined)

export function GlobalModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [modalData, setModalData] = useState<any>(null)

  const openModal = (type: ModalType, data?: any) => {
    setActiveModal(type)
    setModalData(data)
  }

  const closeModal = () => {
    setActiveModal(null)
    setModalData(null)
  }

  const openAreaSelectionModal = () => {
    setActiveModal('areaSelection')
    setModalData(null)
  }

  const openPersonSelectionModal = () => {
    setActiveModal('personSelection')
    setModalData(null)
  }

  const openEditCategoryModal = (category: Category) => {
    setActiveModal('editCategory')
    setModalData(category)
  }

  const openDeleteCategoryModal = (category: Category) => {
    setActiveModal('deleteCategory')
    setModalData(category)
  }

  const openInProgressSchedulesModal = () => {
    setActiveModal('inProgressSchedules')
    setModalData(null)
  }

  const openPublishedSchedulesModal = () => {
    setActiveModal('publishedSchedules')
    setModalData(null)
  }

  return (
    <GlobalModalContext.Provider value={{ 
      openModal, 
      closeModal, 
      openAreaSelectionModal, 
      openPersonSelectionModal,
      openEditCategoryModal,
      openDeleteCategoryModal,
      openInProgressSchedulesModal,
      openPublishedSchedulesModal
    }}>
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

      {/* Area Selection Modal */}
      <Modal
        isOpen={activeModal === 'areaSelection'}
        onClose={closeModal}
        title="View Area Schedule"
      >
        <AreaSelectionContent
          onCancel={closeModal}
        />
      </Modal>

      {/* Person Selection Modal */}
      <Modal
        isOpen={activeModal === 'personSelection'}
        onClose={closeModal}
        title="View Person Schedule"
      >
        <PersonSelectionContent
          onCancel={closeModal}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={activeModal === 'editCategory'}
        onClose={closeModal}
        title="Edit Category"
      >
        {modalData && (
          <EditCategoryForm
            category={modalData}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        )}
      </Modal>

      {/* Delete Category Modal */}
      <Modal
        isOpen={activeModal === 'deleteCategory'}
        onClose={closeModal}
        title="Delete Category"
      >
        {modalData && (
          <DeleteCategoryModal
            category={modalData}
            onSuccess={closeModal}
            onCancel={closeModal}
          />
        )}
      </Modal>

      {/* In Progress Schedules Modal */}
      <Modal
        isOpen={activeModal === 'inProgressSchedules'}
        onClose={closeModal}
        title="In Progress Schedules"
      >
        <InProgressScheduleSelection
          onCancel={closeModal}
          onScheduleSelected={closeModal}
        />
      </Modal>

      {/* Published Schedules Modal */}
      <Modal
        isOpen={activeModal === 'publishedSchedules'}
        onClose={closeModal}
        title="Published Schedules"
      >
        <PublishedScheduleSelection
          onCancel={closeModal}
          onScheduleSelected={closeModal}
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