import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UploadPfpForm from '../UploadPfpForm.jsx'
import { jwtDecode } from 'jwt-decode'
import { getToken, applicantApi, companyApi, adminApi } from '../../../utils/api.js'

jest.mock('jwt-decode', () => ({ jwtDecode: jest.fn() }))

jest.mock('../../../utils/api.js', () => ({
    getToken: jest.fn(),
    applicantApi: { uploadPfp: jest.fn() },
    companyApi: { uploadPfp: jest.fn() },
    adminApi: { uploadPfp: jest.fn() },
}))

describe('UploadPfpForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn().mockResolvedValue({ ok: true })
        getToken.mockReturnValue('t')
    })

    test('applicant upload calls applicantApi.uploadPfp and fetches returned url', async () => {
        jwtDecode.mockReturnValue({ role: 'applicant', id: 'a1' })
        applicantApi.uploadPfp.mockReturnValue('http://upload')

        render(<UploadPfpForm />)

        await waitFor(() => expect(jwtDecode).toHaveBeenCalled())

        const form = screen.getByRole('heading', { name: /upload profile picture below/i }).closest('form')
        const input = form.querySelector('#image-input')
        const file = new File(['pdf'], 'resume.pdf', { type: 'application/pdf' })

        fireEvent.change(input, {
            target: { files: [file] },
        })

        fireEvent.submit(form)

        await waitFor(() => {
            expect(applicantApi.uploadPfp).toHaveBeenCalledWith('a1', file)
            expect(fetch).toHaveBeenCalledWith('http://upload')
        })
    })
})