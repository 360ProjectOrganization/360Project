import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getToken, applicantApi, companyApi } from '../../../utils/api.js'
import { jwtDecode } from 'jwt-decode'
import Dropdown from '../Dropdown.jsx'


jest.mock('../../../utils/api.js', () => ({
    getToken: jest.fn(),
    applicantApi: { getById: jest.fn() },
    companyApi: { getById: jest.fn() },
}))

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
}))

jest.mock('../ProfilePicture.jsx', () => ({
    __esModule: true,
    default: function MockProfilePicture() {
        return <div data-testid="profile-picture">PFP</div>
    },
}))

function renderDropdown() {
    return render(
        <MemoryRouter>
            <Dropdown />
        </MemoryRouter>
    )
}

function openDropdown() {
    fireEvent.mouseEnter(screen.getByRole('button', { name: /get started|welcome/i }).closest('#dropdown-container'))
}

describe('Dropdown', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        getToken.mockReturnValue(null)
        jwtDecode.mockReturnValue({role: '', id: ''})
    })

    test('logged out: shows Get Started and Login / Register links when hovered', () => {
        renderDropdown()
        expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()
        expect(screen.queryByTestId('profile-picture')).not.toBeInTheDocument()

        openDropdown()
        const login = screen.getByRole('link', { name: 'Login' })
        const register = screen.getByRole('link', { name: 'Register' })
        expect(login).toHaveAttribute('href', '/Login')
        expect(register).toHaveAttribute('href', '/register')
    })

    test('logged in as applicant: Shows Welcome with first name and clears default links', async () => {
        getToken.mockReturnValue('validtoken')
        jwtDecode.mockReturnValue({ role: 'applicant', id: 'user-1' })
        applicantApi.getById.mockResolvedValue({ name: 'John Doe' })

        renderDropdown()

        expect(await screen.findByRole('button', { name: 'Welcome, John' })).toBeInTheDocument()
        expect(screen.getByTestId('profile-picture')).toBeInTheDocument()

        openDropdown()
        expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Register' })).not.toBeInTheDocument()
    })

    test('logged in as company: Shows Welcome with company name and clears default links', async () => {
        getToken.mockReturnValue('validtoken')
        jwtDecode.mockReturnValue({ role: 'company', id: 'company-1' })
        companyApi.getById.mockResolvedValue({ name: 'J Inc' })

        renderDropdown()

        expect(await screen.findByRole('button', { name: 'Welcome, J Inc' })).toBeInTheDocument()
        expect(screen.getByTestId('profile-picture')).toBeInTheDocument()

        openDropdown()
        expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Register' })).not.toBeInTheDocument()
    })

    test('logged in as admin: SHows Welcome with Admin and clears default links', async () => {
        getToken.mockReturnValue('validtoken')
        jwtDecode.mockReturnValue({ role: 'administrator', id: 'admin-1' })

        renderDropdown()

        expect(screen.getByRole('button', { name: 'Welcome, Admin' })).toBeInTheDocument()
        expect(screen.getByTestId('profile-picture')).toBeInTheDocument()

        openDropdown()
        expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: 'Register' })).not.toBeInTheDocument()
    })
})