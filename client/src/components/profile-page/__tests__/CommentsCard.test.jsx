import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CommentsCard from '../Comments/CommentsCard.jsx'
import { formatDate } from '../../../utils/formatHelpers.js'

jest.mock('../../../utils/formatHelpers.js', () => ({
    formatDate: jest.fn(),
}))

test('renders comment and triggers delete/view', () => {
    formatDate.mockReturnValue('Jan 1')

    const onSaveEdit = jest.fn()
    const onDeleteClick = jest.fn()
    const onViewJobPost = jest.fn()

    const comment = {
        _id: 'c1',
        jobId: 'p1',
        jobTitle: 'Engineer',
        content: 'Hello',
        createdAt: '2026-01-01',
    }

    render(
        <CommentsCard comment={comment} onSaveEdit={onSaveEdit} onDeleteClick={onDeleteClick} onViewJobPost={onViewJobPost} />
    )

    expect(screen.getByText('Engineer')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('Jan 1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onDeleteClick).toHaveBeenCalledWith(comment)

    fireEvent.click(screen.getByRole('button', { name: /view job post/i }))
    expect(onViewJobPost).toHaveBeenCalledWith(comment)
})

test('edit mode save calls onSaveEdit and disables save when blank', async () => {
    formatDate.mockReturnValue('Jan 1')

    const onSaveEdit = jest.fn().mockResolvedValue({})
    const comment = { _id: 'c1', jobId: 'p1', jobTitle: 'Engineer', content: 'Hello', createdAt: '2026-01-01' }

    render(<CommentsCard comment={comment} onSaveEdit={onSaveEdit} onDeleteClick={() => {}} />)

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: '   ' } })
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()

    fireEvent.change(textarea, { target: { value: 'Updated' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSaveEdit).toHaveBeenCalledWith('c1', 'p1', 'Updated')
})