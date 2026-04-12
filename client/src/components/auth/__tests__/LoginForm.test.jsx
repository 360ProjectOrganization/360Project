import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import LoginForm from '../login/LoginForm.jsx'
import { ProfilePictureGlobal } from '../../../context/ProfilePictureContext.jsx'
import { authApi, setToken, setAuthUser } from '../../../utils/api.js'

jest.mock('../../../utils/api.js', () => ({
    authApi: { login: jest.fn() },
    setToken: jest.fn(),
    setAuthUser: jest.fn(),
    getToken: jest.fn(() => null),
    clearToken: jest.fn(),
    applicantApi: { getPfpUrl: jest.fn() },
    companyApi: { getPfpUrl: jest.fn() },
    adminApi: { getPfpUrl: jest.fn() },
}))

function PathnameProbe() {
    const { pathname } = useLocation()
    return <span data-testid="pathname">{pathname}</span>
}

function renderLoginForm(typeOfUser = 'Applicant', initialEntry = '/') {
    const setOnLoginScreen = jest.fn()
    const setLoginType = jest.fn()

    const entry = typeof initialEntry === 'string' ? { pathname: initialEntry, state: undefined } : initialEntry
    
    render(
        <MemoryRouter initialEntries={[entry]}>
            <ProfilePictureGlobal>
                <Routes>
                    <Route path="*" element={
                        <>
                            <LoginForm typeOfUser={typeOfUser} setOnLoginScreen={setOnLoginScreen} setLoginType={setLoginType} />
                            <PathnameProbe />
                        </>
                    }
                    />
                </Routes>
            </ProfilePictureGlobal>
        </MemoryRouter>
    )

    return {setOnLoginScreen, setLoginType}
}

describe('LoginForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        authApi.login.mockResolvedValue({ token: 'validtoken', user: { id: 'u1', name: 'Test User' } })
    })

    test('successful login calls API with applicant role, saves session, navigates to returnTo', async () => {
        renderLoginForm('Applicant', { pathname: '/Login', state: { returnTo: '/profile' } })
        
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' } })
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret123' } })
        fireEvent.click(screen.getByRole('button', { name: 'Login' }))
        
        await waitFor(() => {
            expect(authApi.login).toHaveBeenCalledWith({
                role: 'applicant',
                email: 'a@b.com',
                password: 'secret123',
            })
        })

        expect(setToken).toHaveBeenCalledWith('validtoken')
        expect(setAuthUser).toHaveBeenCalledWith(expect.objectContaining({ id: 'u1' }))
        await waitFor(() => {
            expect(screen.getByTestId('pathname')).toHaveTextContent('/profile')
        })
    })

    test('maps Employer to company and Admin to administrator', async () => {
        renderLoginForm('Employer', '/Login')
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'c@d.com' } })
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'secret123' } })
        fireEvent.click(screen.getByRole('button', { name: 'Login' }))
        
        await waitFor(() => {
            expect(authApi.login).toHaveBeenCalledWith(expect.objectContaining({role: 'company'}))
        })
    })

    test('shows error message when login fails', async () => {
        authApi.login.mockRejectedValue(new Error('Invalid credentials'))
        renderLoginForm('Applicant', '/Login')
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' }, })
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrong' }, })
        fireEvent.click(screen.getByRole('button', { name: 'Login' }))
        await waitFor(() => {
            expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
        })
        expect(setToken).not.toHaveBeenCalled()
    })
})

