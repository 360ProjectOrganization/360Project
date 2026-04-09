import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import ViewApplicantsForm from '../ViewApplicantsForm.jsx'
import { applicantApi } from '../../../utils/api'
import { formatDate } from '../../../utils/formatHelpers.js'

jest.mock('../../../utils/api', () => ({
    applicantApi: { getById: jest.fn() },
}))

jest.mock('../../../utils/formatHelpers.js', () => ({
    formatDate: jest.fn(),
}))

jest.mock('../../common/Row.jsx', () => ({
    __esModule: true,
    default: ({ name, email }) => <div data-testid="row">{name} {email}</div>,
}))

test('renders posting details and applicant rows', async () => {
    formatDate.mockReturnValue('Jan 1')
    applicantApi.getById
        .mockResolvedValueOnce({
            _id: 'a1', name: 'Jane', status: 'active', email: 'jane@pp.com',
            jobsAppliedTo: [{ job: 'p1', appliedAt: '2026-01-01' }],
        })
        .mockResolvedValueOnce({
            _id: 'a2', name: 'Elizabeth', status: 'active', email: 'elizabeth@pp.com',
            jobsAppliedTo: [{ job: 'p1', appliedAt: '2026-01-02' }],
        })

    render(
        <ViewApplicantsForm
            posting={{ _id: 'p1', title: 't_title', publishedAt: '2026-01-01', applicants: ['a1', 'a2'] }}
        />
    )

    expect(screen.getByText('t_title')).toBeInTheDocument()
    expect(screen.getByText('Jan 1')).toBeInTheDocument()

    await waitFor(() => {
        expect(screen.getAllByTestId('row')).toHaveLength(2)
    })
})