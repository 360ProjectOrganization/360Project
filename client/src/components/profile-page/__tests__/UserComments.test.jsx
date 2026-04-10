import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import UserComments from '../Comments/UserComments.jsx'
import { jobPostingApi } from '../../../utils/api'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom')
    return { ...actual, useNavigate: () => mockNavigate }
})

jest.mock('../../../utils/api', () => ({
    jobPostingApi: {
        getMyComments: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
    },
}))

jest.mock('../../common/Modal', () => ({
    __esModule: true,
    default: ({ isOpen, title, children }) => (isOpen ? <div data-testid="modal"><div>{title}</div>{children}</div> : null),
}))

jest.mock('../Comments/CommentsCard', () => ({
    __esModule: true,
    default: ({ comment, onDeleteClick, onViewJobPost }) => (
        <div>
            <div>{comment.jobTitle}</div>
            <button onClick={() => onDeleteClick(comment)}>Delete</button>
            <button onClick={() => onViewJobPost(comment)}>View Job Post</button>
        </div>
    ),
}))

describe('UserComments', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockNavigate.mockClear()
    })

    test('loads and shows comments', async () => {
        jobPostingApi.getMyComments.mockResolvedValue([
            { _id: 'c1', jobId: 'p1', jobTitle: 'Engineer', content: 'x', createdAt: '2026-01-01' },
        ])

        render(
            <MemoryRouter>
                <UserComments />
            </MemoryRouter>
        )

        expect(screen.getByText(/loading/i)).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('Engineer')).toBeInTheDocument()
        })
    })

    test('delete flow calls deleteComment then refreshes', async () => {
        jobPostingApi.getMyComments
            .mockResolvedValueOnce([{ _id: 'c1', jobId: 'p1', jobTitle: 'Engineer', content: 'x', createdAt: '2026-01-01' }])
            .mockResolvedValueOnce([])

        jobPostingApi.deleteComment.mockResolvedValue({})

        render(
            <MemoryRouter>
                <UserComments />
            </MemoryRouter>
        )

        await waitFor(() => expect(screen.getByText('Engineer')).toBeInTheDocument())

        fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
        expect(screen.getByTestId('modal')).toHaveTextContent('Delete Comment')

        fireEvent.click(screen.getByRole('button', { name: /confirm/i }))

        await waitFor(() => {
            expect(jobPostingApi.deleteComment).toHaveBeenCalledWith('p1', 'c1')
        })
    })

    test('view job post flow navigates with openPostingId', async () => {
        jobPostingApi.getMyComments.mockResolvedValue([
            { _id: 'c1', jobId: 'p1', jobTitle: 'Engineer', content: 'x', createdAt: '2026-01-01' },
        ])

        render(
            <MemoryRouter>
                <UserComments />
            </MemoryRouter>
        )

        await waitFor(() => expect(screen.getByText('Engineer')).toBeInTheDocument())

        fireEvent.click(screen.getByRole('button', { name: /view job post/i }))
        expect(screen.getByTestId('modal')).toHaveTextContent('Leave profile?')

        fireEvent.click(screen.getByRole('button', { name: /yes, go to job/i }))

        expect(mockNavigate).toHaveBeenCalledWith('/', { state: { openPostingId: 'p1' } })
    })
})