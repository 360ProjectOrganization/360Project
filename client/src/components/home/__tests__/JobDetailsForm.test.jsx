import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import JobDetailsForm from '../JobDetailsForm.jsx'
import { jobPostingApi } from '../../../utils/api.js'

jest.mock('../JobComments.jsx', () => ({
    __esModule: true,
    default: () => <div data-testid="comments-stub" />,
}))

jest.mock('../../../utils/api.js', () => ({
    jobPostingApi: { apply: jest.fn() },
}))

function PathProbe() {
    const { pathname, state } = useLocation()
    return (
        <span data-testid="loc">
            {pathname}|{state?.openPostingId ?? ''}|{state?.returnTo ?? ''}
        </span>
    )
}

const posting = {
    _id: 'post1',
    companyId: 'co1',
    companyName: 'test_company',
    location: 'Remote',
    description: 'Do things',
    tags: ['React'],
    publishedAt: '2025-01-01T00:00:00.000Z',
    applicants: [],
}

function renderForm(props, initialPath = '/') {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="*" element={
                        <>
                            <JobDetailsForm posting={posting} {...props} />
                            <PathProbe />
                        </>
                    }
                />
            </Routes>
        </MemoryRouter>
    )
}

describe('JobDetailsForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('renders company, location, description, tags, posted date', () => {
        renderForm({
            role: 'applicant',
            userId: 'u1',
            isAuthenticated: true,
            onSuccess: jest.fn(),
            onCancel: jest.fn(),
        })
        expect(screen.getByText(/test_company/)).toBeInTheDocument()
        expect(screen.getByText(/Remote/)).toBeInTheDocument()
        expect(screen.getByText(/Do things/)).toBeInTheDocument()
        expect(screen.getByByText?.('React') || screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByTestId('comments-stub')).toBeInTheDocument()
    })

    test('unauthenticated user sees Apply and navigates to Login with state', () => {
        renderForm({
            role: '',
            userId: '',
            isAuthenticated: false,
            onSuccess: jest.fn(),
            onCancel: jest.fn(),
        })
        fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
        expect(screen.getByTestId('loc').textContent).toContain('/Login')
        expect(screen.getByTestId('loc').textContent).toContain('post1')
    })

    test('applicant applies and calls onSuccess', async () => {
        jobPostingApi.apply.mockResolvedValue({})
        const onSuccess = jest.fn()
        renderForm({
            role: 'applicant',
            userId: 'u1',
            isAuthenticated: true,
            onSuccess,
            onCancel: jest.fn(),
        })
        fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
        await waitFor(() => {
            expect(jobPostingApi.apply).toHaveBeenCalledWith('post1')
            expect(onSuccess).toHaveBeenCalled()
        })
    })

    test('shows Applied and disables button when already applied', () => {
        renderForm({
            role: 'applicant',
            userId: 'u1',
            isAuthenticated: true,
            onSuccess: jest.fn(),
            onCancel: jest.fn(),
            posting: { ...posting, applicants: ['u1'] },
        })
        expect(screen.getByRole('button', { name: 'Applied' })).toBeDisabled()
    })

    test('company owner sees Edit Post', () => {
        renderForm({
            role: 'company',
            userId: 'co1',
            isAuthenticated: true,
            onSuccess: jest.fn(),
            onCancel: jest.fn(),
        })
        expect(screen.getByRole('button', { name: 'Edit Post' })).toBeInTheDocument()
    })
})