import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Modal from '../../ui/Modal'

describe('Modal (shared UI)', () => {
  it('does not render when closed', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Closed">
        <div>content</div>
      </Modal>
    )
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders centered on open and shows title/children', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Hello</div>
      </Modal>
    )

    const dialog = screen.getByRole('dialog') as HTMLDivElement
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()

    // Expect non-zero centered-ish positioning (no initial snap to 0,0)
    expect(dialog.style.top).not.toBe('')
    expect(dialog.style.left).not.toBe('')
    expect(dialog.style.top).not.toBe('0px')
    expect(dialog.style.left).not.toBe('0px')
  })

  it('closes when clicking backdrop (no blur)', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Backdrop Close">
        <div>Body</div>
      </Modal>
    )

    // Find the backdrop element (the first fixed element with z-50)
    const backdrop = document.querySelector('div.fixed.inset-0.z-50') as HTMLDivElement
    expect(backdrop).toBeTruthy()

    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it.skip('moves when dragging the header', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Draggable Header">
        <div>Drag Content</div>
      </Modal>
    )

    const dialog = screen.getByRole('dialog') as HTMLDivElement
    const initialTop = dialog.style.top
    const initialLeft = dialog.style.left

    // Header is the parent of the h2
    const title = screen.getByText('Draggable Header')
    const header = title.parentElement as HTMLElement

    // Start drag
    fireEvent.pointerDown(header, { clientX: 100, clientY: 100, pointerId: 1 })
    // Support both pointer and mouse listeners
    fireEvent.pointerMove(document, { clientX: 300, clientY: 250, pointerId: 1 })
    fireEvent.mouseMove(document, { clientX: 300, clientY: 250 })
    fireEvent.pointerUp(document, { pointerId: 1 })
    fireEvent.mouseUp(document)

    await waitFor(() => {
      expect(dialog.style.top).not.toBe(initialTop)
      expect(dialog.style.left).not.toBe(initialLeft)
    })
  })
})


