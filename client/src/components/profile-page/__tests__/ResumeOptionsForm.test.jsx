import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ResumeOptionsForm from '../ResumeOptionsForm.jsx'
import { jwtDecode } from 'jwt-decode'
import { getToken, applicantApi } from '../../../utils/api.js'

jest.mock('jwt-decode', () => ({ jwtDecode: jest.fn() }))

jest.mock('../../../utils/api.js', () => ({
    getToken: jest.fn(),
    applicantApi: {
        getResumeUrl: jest.fn(),
        getResumeViewUrl: jest.fn(),
    },
}))

describe('ResumeOptionsForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        getToken.mockReturnValue('t')
        jwtDecode.mockReturnValue({ role: 'applicant', id: 'a1' })
        global.fetch = jest.fn()
        window.open = jest.fn()
    })

    test('requires an option', () => {
        render(<ResumeOptionsForm />)
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))
        expect(screen.getByText('No Option Selected')).toBeInTheDocument()
    })

    test('404 shows upload first message', async () => {
        applicantApi.getResumeViewUrl.mockReturnValue('http://view')
        fetch.mockResolvedValue({ status: 404 })

        render(<ResumeOptionsForm />)
        fireEvent.click(screen.getByLabelText(/in browser/i))
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(screen.getByText('Upload a Resume First Before Viewing')).toBeInTheDocument()
        })
    })

    test('success opens window', async () => {
        applicantApi.getResumeUrl.mockReturnValue('http://download')
        fetch.mockResolvedValue({ status: 200 })

        render(<ResumeOptionsForm />)
        fireEvent.click(screen.getByLabelText(/download/i))
        fireEvent.click(screen.getByRole('button', { name: /submit/i }))

        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('http://download', '_blank')
        })
    })
})