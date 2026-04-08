import React from 'react'
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomeJobPostings from '../HomeJobPostings.jsx'
import { getToken, companyApi } from '../../../utils/api.js'
import { jwtDecode } from 'jwt-decode'
import { filterJobPostings } from '../../../utils/filterHelper.js'

jest.mock('../../../utils/api.js', () => ({
    getToken: jest.fn(),
    companyApi: {
        getAll: jest.fn(),
        getJobPostings: jest.fn(),
    },
}))

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
}))

jest.mock('../../../utils/filterHelper.js', () => ({
    filterJobPostings: jest.fn(),
}))

jest.mock('../JobDetailsForm.jsx', () => ({
    __esModule: true,
    default: ({ posting }) => <div data-testid="job-details">{posting?.title}</div>,
}))

const activePosting = (overrides = {}) => ({
    _id: 'p1',
    title: 'Engineer',
    companyName: 'Acme',
    companyId: 'c1',
    location: 'Remote',
    description: 'Build',
    publishedAt: '2025-01-02T00:00:00.000Z',
    status: 'ACTIVE',
    tags: ['React'],
    applicants: [],
    ...overrides,
})

function renderHomeJobPostings(ui = <HomeJobPostings />, { initialEntries = ['/'] } = {}) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {ui}
        </MemoryRouter>
    )
}

describe('HomeJobPostings', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        getToken.mockReturnValue(null)
        jwtDecode.mockReturnValue({ role: '', id: '' })
        filterJobPostings.mockImplementation((active) => active)
    })

    test('shows loading then empty when no postings', async () => {
        let resolveAll
        companyApi.getAll.mockImplementation(
            () => new Promise((r) => { resolveAll = r })
        )

        renderHomeJobPostings()

        expect(screen.getByText(/loading job postings/i)).toBeInTheDocument()
        resolveAll([])
        await waitFor(() => {
            expect(screen.getByText(/no job postings/i)).toBeInTheDocument()
        })
    })

    test('shows load error message', async () => {
        companyApi.getAll.mockRejectedValue(new Error('Network down'))

        renderHomeJobPostings()
        expect(await screen.findByText('Network down')).toBeInTheDocument()
    })

    test('renders cards: unauthenticated user sees Details', async () => {
        getToken.mockReturnValue(null)
        companyApi.getAll.mockResolvedValue([{ _id: 'c1', name: 'Acme' }])
        companyApi.getJobPostings.mockResolvedValue([activePosting()])

        renderHomeJobPostings()

        expect(await screen.findByText('Engineer')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument()
    })

    test('applicant sees Apply and Applied badge', async () => {
        getToken.mockReturnValue('t')
        jwtDecode.mockReturnValue({ role: 'applicant', id: 'u1' })
        companyApi.getAll.mockResolvedValue([{ _id: 'c1', name: 'Acme' }])
        companyApi.getJobPostings.mockResolvedValue([
            activePosting({ applicants: ['u1'] }),
        ])

        renderHomeJobPostings()

        expect(await screen.findByRole('button', { name: 'Apply' })).toBeInTheDocument()
        const jobCard = screen.getByRole('heading', { name: 'Engineer' }).closest('.card-container')
        expect(within(jobCard).getByText('Applied')).toBeInTheDocument()
    })

    test('company sees Your Post on own job', async () => {
        getToken.mockReturnValue('t')
        jwtDecode.mockReturnValue({ role: 'company', id: 'c1' })
        companyApi.getAll.mockResolvedValue([{ _id: 'c1', name: 'Acme' }])
        companyApi.getJobPostings.mockResolvedValue([activePosting()])

        renderHomeJobPostings()

        expect(await screen.findByText('Your Post')).toBeInTheDocument()
    })

    test('no results when filter returns empty', async () => {
        companyApi.getAll.mockResolvedValue([{ _id: 'c1', name: 'Acme' }])
        companyApi.getJobPostings.mockResolvedValue([activePosting()])
        filterJobPostings.mockReturnValue([])

        renderHomeJobPostings()

        expect(await screen.findByText(/no job postings match your search/i)).toBeInTheDocument()
    })

    test('opens modal with job title when Details clicked', async () => {
        companyApi.getAll.mockResolvedValue([{ _id: 'c1', name: 'Acme' }])
        companyApi.getJobPostings.mockResolvedValue([activePosting()])

        renderHomeJobPostings()

        fireEvent.click(await screen.findByRole('button', { name: 'Details' }))
        expect(screen.getByTestId('job-details')).toHaveTextContent('Engineer')
    })
})