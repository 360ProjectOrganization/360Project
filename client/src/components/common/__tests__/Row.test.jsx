import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Row from '../Row.jsx'
import { applicantApi } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
    applicantApi: { getPfpUrl: jest.fn() },
}))

jest.mock('../../../utils/formatHelpers', () => ({
    formatDate: jest.fn(() => 'Formatted Date'),
}))

jest.mock('../Modal', () => ({
    __esModule: true,
    default: ({ isOpen, title, children }) =>
        isOpen ? (
            <div data-testid="modal">
                <div>{title}</div>
                {children}
            </div>
        ) : null,
}))

jest.mock('../../company-portal/ViewResumeForm', () => ({
    __esModule: true,
    default: ({ applicantId }) => <div data-testid="view-resume">ViewResumeForm {applicantId}</div>,
}))

describe('Row', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn().mockResolvedValue({ status: 404 })
        global.URL.createObjectURL = jest.fn(() => 'blob:pfp')
        applicantApi.getPfpUrl.mockReturnValue('http://pfp')
    })

    test('renders applicant info and formatted date', () => {
        render(<Row name="Alice" id="a1" email="a@b.com" status="active" date="2026-01-01" />)

        expect(screen.getByText('Alice')).toBeInTheDocument()
        expect(screen.getByText('a@b.com')).toBeInTheDocument()
        expect(screen.getByText('active')).toBeInTheDocument()
        expect(screen.getByText(/Applied/i)).toBeInTheDocument()
        expect(screen.getByText(/Formatted Date/)).toBeInTheDocument()
    })

    test('clicking View Resume opens modal with ViewResumeForm', () => {
        render(<Row name="Alice" id="a1" email="a@b.com" status="active" date="2026-01-01" />)
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: /view resume/i }))

        expect(screen.getByTestId('modal')).toHaveTextContent('Viewing Options')
        expect(screen.getByTestId('view-resume')).toHaveTextContent('ViewResumeForm a1')
    })
})


