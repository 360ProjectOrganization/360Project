import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { getToken, applicantApi, companyApi, adminApi } from '../../../utils/api.js'
import { jwtDecode } from 'jwt-decode'
import ProfilePicture from '../ProfilePicture.jsx'

jest.mock('../../../utils/api.js', () => ({
    getToken: jest.fn(),
    applicantApi: {
        getPfpUrl: jest.fn((id) => `/api/applicants/${id}/pfp`),
    },
    companyApi: {
        getPfpUrl: jest.fn((id) => `/api/companies/${id}/pfp`),
    },
    adminApi: {
        getPfpUrl: jest.fn((id) => `/api/admin/${id}/pfp`),
    },
}))

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
}))

describe('ProfilePicture', () => {
    const originalFetch = global.fetch
    const originalCreateObjectURL = URL.createObjectURL

    beforeEach(() => {
        jest.clearAllMocks()
        getToken.mockReturnValue('token')
        jwtDecode.mockReturnValue({ role: 'applicant', id: 'u1' })
        global.fetch = jest.fn(() =>
            Promise.resolve({
                status: 200,
                blob: () => Promise.resolve(new Blob(['x'], { type: 'image/png' })),
            })
        )
        URL.createObjectURL = jest.fn(() => 'blob:mock-url')
    })

    afterEach(() => {
        global.fetch = originalFetch
        URL.createObjectURL = originalCreateObjectURL
    })

    test('loads applicant pfp and sets img src', async () => {
        render(<ProfilePicture />)

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalled()
        })
        expect(applicantApi.getPfpUrl).toHaveBeenCalledWith('u1')
        await waitFor(() => {
            const img = screen.getByRole('img', { name: 'pfp' })
            expect(img).toHaveAttribute('src', 'blob:mock-url')
        })
    })

    test('uses company pfp url when role is company', async () => {
        jwtDecode.mockReturnValue({ role: 'company', id: 'c1' })
        render(<ProfilePicture />)
        await waitFor(() => {
            expect(companyApi.getPfpUrl).toHaveBeenCalledWith('c1')
        })
    })

    test('uses admin pfp url when role is administrator', async () => {
        jwtDecode.mockReturnValue({ role: 'administrator', id: 'a1' })
        render(<ProfilePicture />)
        await waitFor(() => {
            expect(adminApi.getPfpUrl).toHaveBeenCalledWith('a1')
        })
    })

    test('does not fetch when there is no token', async () => {
        getToken.mockReturnValue(null)
        render(<ProfilePicture />)
        await waitFor(() => {
            expect(screen.getByRole('img', { name: 'pfp' })).toBeInTheDocument()
        })
        expect(global.fetch).not.toHaveBeenCalled()
        expect(applicantApi.getPfpUrl).not.toHaveBeenCalled()
        expect(companyApi.getPfpUrl).not.toHaveBeenCalled()
        expect(adminApi.getPfpUrl).not.toHaveBeenCalled()
    })

    test('does not fetch for an unknown role', async () => {
        jwtDecode.mockReturnValue({ role: 'guest', id: 'g1' })
        render(<ProfilePicture />)
        await waitFor(() => {
            expect(screen.getByRole('img', { name: 'pfp' })).toBeInTheDocument()
        })
        await waitFor(() => {
            expect(jwtDecode).toHaveBeenCalled()
        })
        expect(global.fetch).not.toHaveBeenCalled()
        expect(applicantApi.getPfpUrl).not.toHaveBeenCalled()
        expect(companyApi.getPfpUrl).not.toHaveBeenCalled()
        expect(adminApi.getPfpUrl).not.toHaveBeenCalled()
    })
})