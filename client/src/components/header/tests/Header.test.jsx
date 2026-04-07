import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom'
import Header from '../Header.jsx'
import { getToken } from '../../../utils/api.js'
import { jwtDecode } from 'jwt-decode'

jest.mock('../../../utils/api.js', () => ({
    getToken: jest.fn(),
}))

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
}))

jest.mock('../Dropdown.jsx', () => ({
    __esModule: true,
    default: function MockDropdown() {
        return <div data-testid="dropdown">Dropdown</div>
    },
}))

jest.mock('../Breadcrumbs.jsx', () => ({
    __esModule: true,
    default: function MockBreadcrumbs() {
        return <div data-testid="breadcrumbs">Breadcrumbs</div>
    },
}))

function HeaderWithPathname() {
    const { pathname } = useLocation()
    return (
        <>
            <Header />
            <span data-testid="pathname">{pathname}</span>
        </>
    )
}
 
function renderHeaderAt(initialPath = '/') {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <Routes>
                <Route path="*" element={<HeaderWithPathname />} />
            </Routes>
        </MemoryRouter>
    )
}


describe('Header', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        getToken.mockReturnValue(null)
        jwtDecode.mockReturnValue({role: ''})
    })

    test('renders JobLy title and breadcrumb area', () => {
        renderHeaderAt('/')
        expect(screen.getByText('JobLy')).toBeInTheDocument()
        expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument()
        expect(screen.getByTestId('dropdown')).toBeInTheDocument()
    })

    test('when logged out, does not show profile, portal, or logout actions', () => {
        getToken.mockReturnValue(null)
        renderHeaderAt('/')
        expect(screen.queryByRole('button', { name: 'Profile Page' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Company Portal' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Admin Portal' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument()
    })

    test('when logged in as applicant, shows profile and logout actions', () => {
        getToken.mockReturnValue('validtoken')
        jwtDecode.mockReturnValue({ role: 'applicant', id: '1' })
        renderHeaderAt('/')
        
        expect(screen.queryByRole('button', { name: 'Profile Page' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Logout' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Company Portal' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Admin Portal' })).not.toBeInTheDocument()
    })

    test('when logged in as company, shows company portal and logout actions', () => {
        getToken.mockReturnValue('validtoken')
        jwtDecode.mockReturnValue({ role: 'company', id: '1' })
        renderHeaderAt('/')

        expect(screen.queryByRole('button', { name: 'Profile Page' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Logout' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Company Portal' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Admin Portal' })).not.toBeInTheDocument()
    })

    test('when logged in as admin, shows admin portal and logout actions', () => {
        getToken.mockReturnValue('validtoken')
        jwtDecode.mockReturnValue({ role: 'administrator', id: '1' })
        renderHeaderAt('/')

        expect(screen.queryByRole('button', { name: 'Profile Page' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Logout' })).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Company Portal' })).not.toBeInTheDocument()
        expect(screen.queryByRole('button', { name: 'Admin Portal' })).toBeInTheDocument()
    })

    test('clicking JobLy on home page navigates to Home', () => {
        getToken.mockReturnValue(null)
        renderHeaderAt('/')

        expect(screen.getByTestId('pathname')).toHaveTextContent('/')
        fireEvent.click(screen.getByText('JobLy'))
        expect(screen.getByTestId('pathname')).toHaveTextContent('/')
    })

    test('clicking JobLy on profile page navigates to Home', () => {
        getToken.mockReturnValue(null)
        renderHeaderAt('/profile')

        expect(screen.getByTestId('pathname')).toHaveTextContent('/profile')
        fireEvent.click(screen.getByText('JobLy'))
        expect(screen.getByTestId('pathname')).toHaveTextContent('/')
    })
})
