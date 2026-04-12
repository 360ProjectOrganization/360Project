import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Profile from '../Profile.jsx'
import { ProfilePictureGlobal } from '../../../context/ProfilePictureContext.jsx'
import { jwtDecode } from 'jwt-decode'
import { getToken, applicantApi, companyApi, adminApi } from '../../../utils/api.js'

jest.mock('jwt-decode', () => ({ jwtDecode: jest.fn() }))

jest.mock('../../../utils/api.js', () => ({
    getToken: jest.fn(),
    clearToken: jest.fn(),
    applicantApi: {
        getById: jest.fn(),
        getPfpUrl: jest.fn(),
    },
    companyApi: {
        getById: jest.fn(),
        getPfpUrl: jest.fn(),
        getAll: jest.fn(),
        getJobPostings: jest.fn(),
    },
    adminApi: {
        getPfpUrl: jest.fn(),
    },
}))

jest.mock('../../common/Card.jsx', () => ({
    __esModule: true,
    default: ({ title, children }) => (
        <section data-testid="card">
            <h3>{title}</h3>
            {children}
        </section>
    ),
}))

jest.mock('../../common/Modal.jsx', () => ({
    __esModule: true,
    default: ({ isOpen, title, children }) =>
        isOpen ? (
            <div data-testid="modal">
                <div>{title}</div>
                {children}
            </div>
        ) : null,
}))

jest.mock('../UploadResumeForm.jsx', () => ({ __esModule: true, default: () => <div>UploadResumeForm</div> }))
jest.mock('../EditProfileForm.jsx', () => ({ __esModule: true, default: () => <div>EditProfileForm</div> }))
jest.mock('../UploadPfpForm.jsx', () => ({ __esModule: true, default: () => <div>UploadPfpForm</div> }))
jest.mock('../ResumeOptionsForm.jsx', () => ({ __esModule: true, default: () => <div>ResumeOptionsForm</div> }))
jest.mock('../Comments/UserComments.jsx', () => ({ __esModule: true, default: () => <div>UserComments</div> }))

function renderProfile() {
    return render(
        <MemoryRouter>
            <ProfilePictureGlobal>
                <Profile />
            </ProfilePictureGlobal>
        </MemoryRouter>
    )
}

describe('Profile', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            blob: () => Promise.resolve(new Blob(['x'], { type: 'image/png' })),
        })
        URL.createObjectURL = jest.fn(() => 'blob:mock')
        getToken.mockReturnValue('t')
        jwtDecode.mockReturnValue({ role: 'applicant', id: 'a1' })
        applicantApi.getById.mockResolvedValue({
            name: 'Jane Doe',
            email: 'jane@example.com',
            jobsAppliedTo: [],
        })
        applicantApi.getPfpUrl.mockReturnValue('http://pfp')
        companyApi.getAll.mockResolvedValue([])
    })

    test('renders applicant sidebar buttons', async () => {
        renderProfile()
        await waitFor(() => {
            expect(screen.getByText('Jane Doe')).toBeInTheDocument()
        })
        expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'My Job Applications' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'My Comments' })).toBeInTheDocument()
    })

    test('opens modals when profile action buttons clicked', async () => {
        renderProfile()
        await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument())

        fireEvent.click(screen.getByRole('button', { name: /edit profile/i }))
        expect(screen.getByText('Edit')).toBeInTheDocument()
        expect(screen.getByText('EditProfileForm')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: /upload profile picture/i }))
        expect(screen.getByText('Picture')).toBeInTheDocument()
        expect(screen.getByText('UploadPfpForm')).toBeInTheDocument()
    })

    test('switching to comments section renders UserComments', async () => {
        renderProfile()
        await waitFor(() => expect(screen.getByText('Jane Doe')).toBeInTheDocument())
        fireEvent.click(screen.getByRole('button', { name: 'My Comments' }))
        expect(screen.getByText('UserComments')).toBeInTheDocument()
    })
})