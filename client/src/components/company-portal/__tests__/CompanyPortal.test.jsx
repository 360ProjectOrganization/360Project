import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import CompanyPortal from '../CompanyPortal.jsx'

function renderWithRouter(ui, { initialEntries = ['/'] } = {}) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <Routes>
                <Route path="/" element={ui} />
                <Route path="/profile" element={<div data-testid="profile-route">Profile</div>} />
            </Routes>
        </MemoryRouter>
    )
}

jest.mock('../CompanyPortalJobPostings.jsx', () => ({
    __esModule: true,
    default: () => <div data-testid="job-postings" />,
}))

jest.mock('../CreateJobForm.jsx', () => ({
    __esModule: true,
    default: () => <div data-testid="create-job-form" />,
}))

jest.mock('../../common/Modal.jsx', () => ({
    __esModule: true,
    default: ({ isOpen, title, children }) =>
        isOpen ? (
            <div data-testid="modal">
                <div>{title}</div>
                {children}
            </div>
        ) : null,
}))

describe('CompanyPortal', () => {
    beforeEach(() => {
        localStorage.setItem('jobly_user', JSON.stringify({ _id: 'c1', name: 'P&P' }))
    })

    afterEach(() => localStorage.clear())

    test('profile button navigates to /profile', () => {
        renderWithRouter(<CompanyPortal />)
        fireEvent.click(screen.getByRole('button', { name: /company profile/i }))
        expect(screen.getByTestId('profile-route')).toBeInTheDocument()
    })

    test('create button opens modal', () => {
        renderWithRouter(<CompanyPortal />)

        expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', { name: /create new job posting/i }))
        expect(screen.getByTestId('modal')).toBeInTheDocument()
        expect(screen.getByTestId('create-job-form')).toBeInTheDocument()
    })
})