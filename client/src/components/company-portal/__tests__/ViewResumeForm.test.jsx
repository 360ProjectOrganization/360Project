import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ViewResumeForm from '../ViewResumeForm.jsx'
import { applicantApi } from '../../../utils/api.js'

jest.mock('../../../utils/api.js', () => ({
    applicantApi: {
        getResumeUrl: jest.fn(),
        getResumeViewUrl: jest.fn(),
    },
}))

describe('ViewResumeForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn()
        window.open = jest.fn()
    })

    test('shows error if no option selected', async () => {
        render(<ViewResumeForm applicantId="a1" />)
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
        expect(screen.getByText('No Option Selected')).toBeInTheDocument()
    })

    test('404 shows Applicant Has no Resume', async () => {
        applicantApi.getResumeViewUrl.mockReturnValue('http://bruh/view')
        fetch.mockResolvedValue({ status: 404 })

        render(<ViewResumeForm applicantId="a1" />)
        fireEvent.click(screen.getByLabelText(/in browser/i))
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(screen.getByText('Applicant Has no Resume')).toBeInTheDocument()
        })
        expect(window.open).not.toHaveBeenCalled()
    })

    test('success opens window', async () => {
        applicantApi.getResumeUrl.mockReturnValue('http://bruh/download')
        fetch.mockResolvedValue({ status: 200 })

        render(<ViewResumeForm applicantId="a1" />)
        fireEvent.click(screen.getByLabelText(/download/i))
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('http://bruh/download', '_blank')
        })
    })
})