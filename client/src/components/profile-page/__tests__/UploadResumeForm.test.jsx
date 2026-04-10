import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UploadResumeForm from '../UploadResumeForm.jsx'
import { jwtDecode } from 'jwt-decode'
import { getToken, applicantApi } from '../../../utils/api.js'

jest.mock('jwt-decode', () => ({ jwtDecode: jest.fn() }))

jest.mock('../../../utils/api.js', () => ({
    getToken: jest.fn(),
    applicantApi: { uploadResume: jest.fn() },
}))

describe('UploadResumeForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn().mockResolvedValue({ ok: true })
        getToken.mockReturnValue('t')
        jwtDecode.mockReturnValue({ id: 'a1' })
        applicantApi.uploadResume.mockReturnValue('http://resume-upload')
    })

    test('uploads resume via url and fetches returned url', async () => {
        render(<UploadResumeForm />)

        await waitFor(() => expect(jwtDecode).toHaveBeenCalled())

        const form = screen.getByRole('heading', { name: /upload resume below/i }).closest('form')
        const input = form.querySelector('#resume-input')
        const file = new File(['pdf'], 'resume.pdf', { type: 'application/pdf' })

        fireEvent.change(input, {
            target: { files: [file] },
        })

        fireEvent.submit(form)

        await waitFor(() => {
            expect(applicantApi.uploadResume).toHaveBeenCalledWith('a1', file)
            expect(fetch).toHaveBeenCalledWith('http://resume-upload')
        })
    })
})