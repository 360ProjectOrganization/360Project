import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../Modal.jsx'

describe('Modal', () => {
    test('does not render when isOpen=false', () => {
        render(
            <Modal isOpen={false} onClose={jest.fn()} title="T">
                <div>Body</div>
            </Modal>
        )
        expect(screen.queryByText('Body')).not.toBeInTheDocument()
        expect(screen.queryByText('T')).not.toBeInTheDocument()
    })

    test('renders title and children when isOpen=true', () => {
        render(
            <Modal isOpen={true} onClose={jest.fn()} title="My Modal">
                <div>Content</div>
            </Modal>
        )
        expect(screen.getByText('My Modal')).toBeInTheDocument()
        expect(screen.getByText('Content')).toBeInTheDocument()
    })

    test('close button calls onClose', () => {
        const onClose = jest.fn()
        render(
            <Modal isOpen={true} onClose={onClose} title="My Modal">
                <div>Content</div>
            </Modal>
        )
        fireEvent.click(screen.getByRole('button', { name: '╳' }))
        expect(onClose).toHaveBeenCalledTimes(1)
    })
})

