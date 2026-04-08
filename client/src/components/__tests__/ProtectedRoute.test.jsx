import React from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../ProtectedRoute.jsx'
import { getToken } from '../../utils/api.js'
import { jwtDecode } from 'jwt-decode'

jest.mock('../../utils/api.js', () => ({
    getToken: jest.fn(),
}))

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
}))

function TestApp({ path = '/secret', requiredRole, children }) {
    return (
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path='/Login' element={<div>Login screen</div>} />
                <Route path="/" element={<div>Home screen</div>} />
                <Route path="/secret" element={ 
                    <ProtectedRoute requiredRole={requiredRole}>
                        {children ?? <div>Protected content</div>}
                    </ProtectedRoute>
                }
                />
            </Routes>
        </MemoryRouter>
    )
}

describe('ProtectedRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('no token redirected to /Login', () => {
        getToken.mockReturnValue(null)
        render(<TestApp />)
        expect(screen.getByText('Login screen')).toBeInTheDocument()
        expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    })

    test('invalid token redirects to /Login', () => {
        getToken.mockReturnValue('badtoken')
        jwtDecode.mockImplementation(() => {
            throw new Error('invalid token')
        })
        render(<TestApp />)
        expect(screen.getByText('Login screen')).toBeInTheDocument()
    })

    test('valid token and no requiredRole renders children', () => {
        getToken.mockReturnValue('validtoken')
        jwtDecode.mockReturnValue({ role: 'applicant' })
        render(<TestApp requiredRole={undefined} />)
        expect(screen.getByText('Protected content')).toBeInTheDocument()
    })

    test('wrong requiredRole redirectes to /', () => {
        getToken.mockReturnValue('validtoken')
        jwtDecode.mockReturnValue({ role: 'company' })
        render(<TestApp requiredRole="administrator" />)
        expect(screen.getByText('Home screen')).toBeInTheDocument()
        expect(screen.queryByText('Protected content')).not.toBeInTheDocument()
    })

    test('matching rquiredRole renders children', () => {
        getToken.mockReturnValue('validtoken')
        jwtDecode.mockReturnValue({ role: 'administrator' })
        render(<TestApp requiredRole="administrator" />)
        expect(screen.getByText('Protected content')).toBeInTheDocument()
        expect(screen.queryByText('Home screen')).not.toBeInTheDocument()
    })
})