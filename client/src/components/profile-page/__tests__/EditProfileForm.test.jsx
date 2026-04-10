import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import EditProfileForm from '../EditProfileForm.jsx'
import { authApi, clearToken } from '../../../utils/api'
import { validateEmailChange } from '../../../utils/validation/validateEmailChange'
import { validatePasswordChange } from '../../../utils/validation/validatePasswordChange'

const mockNavigate = jest.fn()

jest.mock('react-router-dom', () => {
    const actual = jest.requireActual('react-router-dom')
    return { ...actual, useNavigate: () => mockNavigate }
})

jest.mock('../../../utils/api', () => ({
    authApi: {
        changeEmail: jest.fn(),
        changePassword: jest.fn(),
    },
    clearToken: jest.fn(),
}))

jest.mock('../../../utils/validation/validateEmailChange', () => ({
    validateEmailChange: jest.fn(),
}))

jest.mock('../../../utils/validation/validatePasswordChange', () => ({
    validatePasswordChange: jest.fn(),
}))

describe('EditProfileForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockNavigate.mockClear()
        validateEmailChange.mockReturnValue({})
        validatePasswordChange.mockReturnValue({})
        authApi.changeEmail.mockResolvedValue({})
        authApi.changePassword.mockResolvedValue({})
    })

    test('blocks email change when validation fails', async () => {
        validateEmailChange.mockReturnValue({ email: 'Invalid email' })

        render(
            <MemoryRouter>
                <EditProfileForm />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByRole('button', { name: /update email/i }))
        await waitFor(() => expect(screen.getByText('Invalid email')).toBeInTheDocument())
        expect(authApi.changeEmail).not.toHaveBeenCalled()
    })

    test('successful email change calls API, clears token, and navigates home', async () => {
        render(
            <MemoryRouter>
                <EditProfileForm />
            </MemoryRouter>
        )

        fireEvent.change(screen.getByPlaceholderText('abc@example.com'), { target: { value: 'new@example.com' } })
        fireEvent.change(screen.getAllByPlaceholderText('password')[0], { target: { value: 'pw' } })
        fireEvent.click(screen.getByRole('button', { name: /update email/i }))

        await waitFor(() => {
            expect(authApi.changeEmail).toHaveBeenCalledWith({ newEmail: 'new@example.com', password: 'pw' })
        })

        expect(mockNavigate).toHaveBeenCalledWith('/')
        expect(clearToken).toHaveBeenCalled()
    })

    test('failed password change shows error', async () => {
        authApi.changePassword.mockRejectedValue(new Error('nope'))

        render(
            <MemoryRouter>
                <EditProfileForm />
            </MemoryRouter>
        )

        fireEvent.change(screen.getAllByPlaceholderText('password')[1], { target: { value: 'oldpw' } })
        fireEvent.change(screen.getByPlaceholderText('new password'), { target: { value: 'Newpass123' } })
        fireEvent.change(screen.getByPlaceholderText('retype new password'), { target: { value: 'Newpass123' } })
        fireEvent.click(screen.getByRole('button', { name: /update password/i }))

        await waitFor(() => {
            expect(screen.getByText('Incorrect Old Password')).toBeInTheDocument()
        })
    })
})