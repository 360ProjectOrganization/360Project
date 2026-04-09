import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreateNewAdminForm from '../CreateNewAdminForm.jsx'
import { authApi } from '../../../utils/api'

jest.mock('../../../utils/api', () => ({
    authApi: {register: jest.fn()}
}))

const TEST_PW = 'Abcdef1234'

function fillMatchingPasswords() {
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: TEST_PW } })
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: TEST_PW } })
}

describe('CreateNewAdminForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        authApi.register.mockResolvedValue({ok: true})
    })

    test('does not call register when all fields are empty', () => {
        render(<CreateNewAdminForm />)
        fireEvent.click(screen.getByRole('button', { name: /create new admin/i }))
        expect(authApi.register).not.toHaveBeenCalled()
    })

    test('shows Full name is required when name is empty and does not submit', async () => {
        render(<CreateNewAdminForm />)
        fillMatchingPasswords()
        fireEvent.click(screen.getByRole('button', { name: /create new admin/i }))

        await waitFor(() => {
            expect(screen.getByText('Full name is required')).toBeInTheDocument()
        })
        expect(authApi.register).not.toHaveBeenCalled()
    })

    test('shows Email is required when email is empty and does not submit', async () => {
        render(<CreateNewAdminForm />)
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'Jane Admin' } })
        fillMatchingPasswords()
        fireEvent.click(screen.getByRole('button', { name: /create new admin/i }))

        await waitFor(() => {
            expect(screen.getByText('Email is required')).toBeInTheDocument()
        })
        expect(authApi.register).not.toHaveBeenCalled()
    })

    test('submits admin payload and shows success message', async () => {
        render(<CreateNewAdminForm />)
        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'Hans Zimmer' } })
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'hans@music.com' } })
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: TEST_PW } })
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: TEST_PW } })
        
        fireEvent.click(screen.getByRole('button', { name: /create new admin/i }))
        
        await waitFor(() => {
            expect(authApi.register).toHaveBeenCalledWith({
                role: 'administrator',
                email: 'hans@music.com',
                password: TEST_PW,
                name: 'Hans Zimmer',
            })
        })

        expect(screen.getByText('New admin created successfully!')).toBeInTheDocument()
    })

    test('success message clears after 2 seconds', async () => {
        jest.useFakeTimers()
        render(<CreateNewAdminForm />)

        fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'Hans Zimmer' } })
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'hans@music.com' } })
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: TEST_PW } })
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: TEST_PW } })
        fireEvent.click(screen.getByRole('button', { name: /create new admin/i }))

        await waitFor(() => {
            expect(screen.getByText('New admin created successfully!')).toBeInTheDocument()
        })
    })
})