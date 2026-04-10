import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Comment from '../Comment.jsx'

const baseComment = {
    _id: 'c1',
    authorId: 'u1',
    author: 'Hank',
    content: 'Ive Got Rights',
    createdAt: '2025-01-01T00:00:00.000Z',
    editedAt: '2025-01-01T00:00:00.000Z',
    authorRole: 'applicant',
}

describe('Comment', () => {
    test('renders author, body, and employer badge when isFromJobOwner', () => {
        render(
            <Comment comment={baseComment} currentUserId="other" role="applicant" isFromJobOwner onSaveEdit={jest.fn()} onDeleteClick={jest.fn()} />
        )
        expect(screen.getByText('Hank')).toBeInTheDocument()
        expect(screen.getByText('Ive Got Rights')).toBeInTheDocument()
        expect(screen.getByText('Employer')).toBeInTheDocument()
    })

    test('shows Admin badge when authorRole is administrator', () => {
        render(
            <Comment comment={{ ...baseComment, authorRole: 'administrator'}} currentUserId="other" role="applicant" isFromJobOwner={false} onSaveEdit={jest.fn()} onDeleteClick={jest.fn()} />
        )
        expect(screen.getByText('Admin')).toBeInTheDocument()
    })

    test('owner can edit and save calls onSaveEdit', async () => {
        const onSaveEdit = jest.fn().mockResolvedValue()
        render(<Comment comment={baseComment} currentUserId="u1" role="applicant" isFromJobOwner={false} onSaveEdit={onSaveEdit} onDeleteClick={jest.fn()} />)
        fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated' } })
        fireEvent.click(screen.getByRole('button', { name: 'Save' }))
        await waitFor(() => {
            expect(onSaveEdit).toHaveBeenCalledWith('c1', 'Updated')
        })
    })

    test('administrator sees Delete even when not owner', () => {
        const onDelete = jest.fn()
        render(
            <Comment comment={baseComment} currentUserId="other" role="administrator" isFromJobOwner={false} onSaveEdit={jest.fn()} onDeleteClick={onDelete} />
        )
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
        expect(onDelete).toHaveBeenCalledWith(expect.objectContaining({ _id: 'c1' }))
    })

    test('non-owner applicant does not see Edit or Delete', () => {
        render(
            <Comment comment={baseComment} currentUserId="other" role="applicant" isFromJobOwner={false} onSaveEdit={jest.fn()} onDeleteClick={jest.fn()} />
        )
        expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    })
})