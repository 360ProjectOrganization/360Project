import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UploadPfpForm from '../UploadPfpForm.jsx'
import { jwtDecode } from 'jwt-decode'
import { getToken, applicantApi, companyApi, adminApi } from '../../../utils/api.js'
import { ProfilePictureGlobal } from '../../../context/ProfilePictureContext.jsx'

jest.mock('jwt-decode', () => ({ jwtDecode: jest.fn() }))

jest.mock('../../../utils/api.js', () => ({
    getToken: jest.fn(),

    clearToken: jest.fn(),

    applicantApi: { uploadPfp: jest.fn(), getPfpUrl: jest.fn((id) => `/api/applicants/${id}/pfp`) },
    companyApi: { uploadPfp: jest.fn(), getPfpUrl: jest.fn() },
    adminApi: { uploadPfp: jest.fn(), getPfpUrl: jest.fn() },
}))

function renderWithPfp(ui) {
    return render(<ProfilePictureGlobal>{ui}</ProfilePictureGlobal>)
}

describe('UploadPfpForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                blob: () => Promise.resolve(new Blob(['x'], { type: 'image/png' })),
            })

        )
        URL.createObjectURL = jest.fn(() => 'blob:mock')
        getToken.mockReturnValue('t')
    })

    test('applicant upload calls applicantApi.uploadPfp and completes flow', async () => {
        jwtDecode.mockReturnValue({ role: 'applicant', id: 'a1' })
        applicantApi.uploadPfp.mockResolvedValue(undefined)
        const onClose = jest.fn()
        renderWithPfp(<UploadPfpForm onClose={onClose} />)
        await waitFor(() => expect(jwtDecode).toHaveBeenCalled())

        const form = screen.getByRole('heading', { name: /upload profile picture below/i }).closest('form')
        const input = form.querySelector('#image-input')
        const file = new File(['x'], 'photo.png', { type: 'image/png' })

        fireEvent.change(input, {
            target: { files: [file] },
        })

        fireEvent.submit(form)

        await waitFor(() => {
            expect(applicantApi.uploadPfp).toHaveBeenCalledWith('a1', file)
            expect(onClose).toHaveBeenCalled()
        })
    })
})