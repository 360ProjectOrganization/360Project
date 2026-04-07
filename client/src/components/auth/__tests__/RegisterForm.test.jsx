import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import RegisterForm from '../register/RegisterForm.jsx'
import { authApi, setToken, setAuthUser, applicantApi, companyApi, } from '../../../utils/api.js'

jest.mock('../../../utils/api.js', () => ({
    authApi: { register: jest.fn() },
    setToken: jest.fn(),
    setAuthUser: jest.fn(),
    applicantApi: { uploadPfp: jest.fn() },
    companyApi: { uploadPfp: jest.fn() },
}))

function PathnameProbe() {
    const { pathname } = useLocation()
    return <span data-testid="pathname">{pathname}</span>
}

const VALID_PASSWORD = 'Abcd1234'

function renderRegisterForm(typeOfUser = 'Applicant', initialEntry = '/') {
    const setOnRegisterScreen = jest.fn()
    const setRegisterType = jest.fn()

    const entry = typeof initialEntry === 'string' ? { pathname: initialEntry, state: undefined } : initialEntry

    render(
        <MemoryRouter initialEntries={[entry]}>
            <Routes>
                <Route path="*" element={
                        <>
                            <RegisterForm typeOfUser={typeOfUser} setOnRegisterScreen={setOnRegisterScreen} setRegisterType={setRegisterType} />
                            <PathnameProbe />
                        </>
                    }
                />
            </Routes>
        </MemoryRouter>
    )

    return { setOnRegisterScreen, setRegisterType }
}

describe('RegisterForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        authApi.register.mockResolvedValue({
            token: 't',
            user: { _id: 'new1', name: 'Jane Doe' },
        })
        applicantApi.uploadPfp.mockResolvedValue({})
    })

    test('shows validation errors when fields are empty', async () => {
        renderRegisterForm('Applicant', '/register')
        fireEvent.click(screen.getByRole('button', { name: 'Register' }))

        await waitFor(() => {
            expect(screen.getByText('Full name is required')).toBeInTheDocument()
        })
        expect(authApi.register).not.toHaveBeenCalled()
    })

    test('successful applicant registration saves session and navigates', async () => {
        renderRegisterForm('Applicant', {
            pathname: '/register',
            state: { returnTo: '/profile' },
        })

        fireEvent.change(screen.getByPlaceholderText('Alice Chains'), { target: { value: 'Jane Doe' }, })
        fireEvent.change(screen.getByPlaceholderText('carson@thecomputer.com'), { target: { value: 'jane@example.com' }, })

        const passwordFields = document.querySelectorAll('.passwordWrapper input[type="password"], .passwordWrapper input[type="text"]')
        fireEvent.change(passwordFields[0], { target: { value: VALID_PASSWORD } })
        fireEvent.change(passwordFields[1], { target: { value: VALID_PASSWORD } })
        fireEvent.click(screen.getByRole('button', { name: 'Register' }))

        await waitFor(() => {
            expect(authApi.register).toHaveBeenCalledWith({
                role: 'applicant',
                email: 'jane@example.com',
                password: VALID_PASSWORD,
                name: 'Jane Doe',
            })
        })
        expect(setToken).toHaveBeenCalledWith('t')
        expect(setAuthUser).toHaveBeenCalled()
        await waitFor(() => {
            expect(screen.getByTestId('pathname')).toHaveTextContent('/profile')
        })
        expect(applicantApi.uploadPfp).not.toHaveBeenCalled()
    })

    test('employer registration sends role company', async () => {
        renderRegisterForm('Employer', '/register')

        fireEvent.change(screen.getByPlaceholderText('Carson versus The Computer'), { target: { value: 'Acme Corp' } })
        fireEvent.change(screen.getByPlaceholderText('carson@thecomputer.com'), { target: { value: 'hr@acme.com' }, })
        const passwordFields = document.querySelectorAll('.passwordWrapper input[type="password"], .passwordWrapper input[type="text"]')
        fireEvent.change(passwordFields[0], { target: { value: VALID_PASSWORD } })
        fireEvent.change(passwordFields[1], { target: { value: VALID_PASSWORD } })
        fireEvent.click(screen.getByRole('button', { name: 'Register' }))

        await waitFor(() => {
            expect(authApi.register).toHaveBeenCalledWith(
                expect.objectContaining({ role: 'company', name: 'Acme Corp' })
            )
        })
    })

    test('shows submit error when API fails', async () => {
        authApi.register.mockRejectedValue(new Error('Email taken'))
        renderRegisterForm('Applicant', '/register')

        fireEvent.change(screen.getByPlaceholderText('Alice Chains'), { target: { value: 'Jane Doe' }, })
        fireEvent.change(screen.getByPlaceholderText('carson@thecomputer.com'), { target: { value: 'jane@example.com' }, })
        const passwordFields = document.querySelectorAll('.passwordWrapper input[type="password"], .passwordWrapper input[type="text"]')
        fireEvent.change(passwordFields[0], { target: { value: VALID_PASSWORD } })
        fireEvent.change(passwordFields[1], { target: { value: VALID_PASSWORD } })
        fireEvent.click(screen.getByRole('button', { name: 'Register' }))

        await waitFor(() => {
            expect(screen.getByText('Email taken')).toBeInTheDocument()
        })
    })
})