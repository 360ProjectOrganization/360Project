import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import JobComments from '../JobComments.jsx'
import { jobPostingApi } from '../../../utils/api.js'

jest.mock('../../../utils/api.js', () => ({
    jobPostingApi: {
        getComments: jest.fn(),
        addComment: jest.fn(),
        updateComment: jest.fn(),
        deleteComment: jest.fn(),
    },
}))

const sampleComments = [
    {
        _id: 'c1',
        authorId: 'u1',
        author: 'Alex',
        content: 'Nice job',
        createdAt: '2025-01-01T00:00:00.000Z',
        editedAt: '2025-01-01T00:00:00.000Z',
        authorRole: 'applicant',
    },
]

describe('JobComments', () => {
    let setIntervalSpy

    beforeEach(() => {
        jest.clearAllMocks()
        setIntervalSpy = jest.spyOn(global, 'setInterval').mockReturnValue(0)
        jobPostingApi.getComments.mockResolvedValue(sampleComments)
    })

    afterEach(() => {
        setIntervalSpy.mockRestore()
    })

    test('loads and lists comments', async () => {
        render(
            <JobComments jobId="j1" ownerCompanyId="co1" currentUserId="u1" role="applicant" isAuthenticated />
        )
        await waitFor(() => {
            expect(jobPostingApi.getComments).toHaveBeenCalledWith('j1')
        })
        expect(await screen.findByText('Nice job')).toBeInTheDocument()
        expect(screen.queryByText('No comments yet.')).not.toBeInTheDocument()
    })

    test('shows empty message when no comments', async () => {
        jobPostingApi.getComments.mockResolvedValue([])
        render(
            <JobComments jobId="j1" ownerCompanyId="co1" currentUserId="u1" role="applicant" isAuthenticated />
        )
        expect(await screen.findByText('No comments yet.')).toBeInTheDocument()
    })

    test('add comment calls API and clears input', async () => {
        jobPostingApi.addComment.mockResolvedValue({})
        render(
            <JobComments jobId="j1" ownerCompanyId="co1" currentUserId="u1" role="applicant" isAuthenticated />
        )
        await screen.findByText('Nice job')

        fireEvent.change(screen.getByPlaceholderText(/write a comment/i), { target: { value: '  New text  ' }, })
        fireEvent.click(screen.getByRole('button', { name: 'Comment' }))

        await waitFor(() => {
            expect(jobPostingApi.addComment).toHaveBeenCalledWith('j1', { content: 'New text' })
        })
        await waitFor(() => expect(screen.getByPlaceholderText(/write a comment/i)).toHaveValue(''))
    })

    test('hides add-comment row when logged out', async () => {
        render(
            <JobComments jobId="j1" ownerCompanyId="co1" currentUserId="u1" role="applicant" isAuthenticated={false} />
        )
        await waitFor(() => expect(jobPostingApi.getComments).toHaveBeenCalled())
        expect(screen.queryByPlaceholderText(/write a comment/i)).not.toBeInTheDocument()
    })

    test('hides add-comment for company that does not own the job', async () => {
        render(
            <JobComments jobId="j1" ownerCompanyId="co1" currentUserId="co2" role="company" isAuthenticated />
        )
        await waitFor(() => expect(jobPostingApi.getComments).toHaveBeenCalled())
        expect(screen.queryByPlaceholderText(/write a comment/i)).not.toBeInTheDocument()
    })
})