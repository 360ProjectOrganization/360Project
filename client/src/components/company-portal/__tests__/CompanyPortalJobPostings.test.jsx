import React from 'react'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CompanyPortalJobPostings from '../CompanyPortalJobPostings.jsx'
import { companyApi, jobPostingApi } from '../../../utils/api.js'

jest.mock('../../../utils/api.js', () => ({
    companyApi: { getJobPostings: jest.fn() },
    jobPostingApi: {updateStatus: jest.fn()},
}))

jest.mock('../../common/Card.jsx', () => ({
    __esModule: true,
    default: ({ title, children, footer }) => (
        <section data-testid="card">
            <h3>{title}</h3>
            <div>{children}</div>
            <div>{footer}</div>
        </section>
    ),
}))

jest.mock('../../common/Modal.jsx', () => ({
    __esModule: true,
    default: ({ isOpen, children, title }) => isOpen ? (
            <div data-testid="modal">
                <div>{title}</div>
                {children}
            </div>
        ) : null,
}))

jest.mock('../EditJobForm.jsx', () => ({
    __esModule: true,
    default: () => <div data-testid="edit-form" />
}))

jest.mock('../ViewApplicantsForm.jsx', () => ({
    __esModule: true,
    default: () => <div data-testid="view-applicants" />,
}))

jest.mock('../CloseStatus.jsx', () => ({
    __esModule: true,
    default: () => null,
}))

function renderView(props) {
    return render(
        <MemoryRouter>
            <CompanyPortalJobPostings {...props} />
        </MemoryRouter>
    )
}

describe('CompanyPortalJobPostings', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('shows missing company id when companyId absent', () => {
        renderView({ companyId: null, companyName: 'Narnia', refreshKey: 0 })
        expect(screen.getByText(/missing company id/i)).toBeInTheDocument()
    })

    test('shows no postings message when API returns empty list', async () => {
        companyApi.getJobPostings.mockResolvedValue([])

        renderView({ companyId: 'c1', companyName: 'Narnia', refreshKey: 0 })

        await waitFor(() => {
            expect(screen.getByText(/no job postings for Narnia/i)).toBeInTheDocument()
        })
    })

    test('renders postings and company header', async () => {
        companyApi.getJobPostings.mockResolvedValue([
            {
                _id: 'p1',
                title: 'Coding',
                location: 'Remote',
                description: 'Build things fr',
                status: 'ACTIVE',
            },
        ])

        renderView({ companyId: 'c1', companyName: 'Narnia', refreshKey: 0 })

        await waitFor(() => {
            expect(screen.getByText("Narnia's Current Postings")).toBeInTheDocument()
        })

        expect(screen.getByText('Coding')).toBeInTheDocument()
        expect(screen.getByText(/location/i)).toBeInTheDocument()
        expect(screen.getByText(/description/i)).toBeInTheDocument()
    })

    test('changing status calls jobPostingApi.updateStatus', async () => {
        companyApi.getJobPostings.mockResolvedValue([
            {
                _id: 'p1',
                title: 'Coding',
                location: 'Remote',
                description: 'Build things fr',
                status: 'ACTIVE',
            },
        ])

        jobPostingApi.updateStatus.mockResolvedValue({ ok: true })

        renderView({ companyId: 'c1', companyName: 'Narnia', refreshKey: 0 })
        await waitFor(() => expect(screen.getByText('Coding')).toBeInTheDocument())

        const card = screen.getByText('Coding').closest('[data-testid="card"]')
        const statusSelect = within(card).getByRole('combobox')

        fireEvent.change(statusSelect, { target: { value: 'UNPUBLISHED' } })

        await waitFor(() => {
            expect(jobPostingApi.updateStatus).toHaveBeenCalledWith('p1', 'UNPUBLISHED', undefined)
        })
    })
})