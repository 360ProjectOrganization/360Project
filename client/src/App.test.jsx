import React from 'react'
import { render, screen } from '@testing-library/react' //render shows components in fake DOM and screen lets us query what's on the page
import { MemoryRouter } from 'react-router-dom' // fake router
import App from './App'

// Mock each page component (basically replaces the real pages with fake ones so we can test routing)
jest.mock('./pages/HomePage', () => () => <div>Home Page</div>)
jest.mock('./pages/RegisterPage', () => () => <div>Register Page</div>)
jest.mock('./pages/LoginPage', () => () => <div>Login Page</div>)
jest.mock('./pages/ProfilePage', () => () => <div>Profile Page</div>)
jest.mock('./pages/CompanyPortalPage', () => () => <div>Company Portal Page</div>)
jest.mock('./pages/AdminPage', () => () => <div>Admin Page</div>)

// sets the url to whatever is passed in and renders the app, reusable for tests
function renderWithRoute(route) {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    )
}

test('renders HomePage on /', () => {
    renderWithRoute('/')
    expect(screen.getByText('Home Page')).toBeInTheDocument()
})

test('renders RegisterPage on /register', () => {
    renderWithRoute('/register')
    expect(screen.getByText('Register Page')).toBeInTheDocument()
})

test('renders LoginPage on /Login', () => {
    renderWithRoute('/Login')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
})

test('renders ProfilePage on /profile', () => {
    renderWithRoute('/profile')
    expect(screen.getByText('Profile Page')).toBeInTheDocument()
})

test('renders CompanyPortalPage on /company-portal', () => {
    renderWithRoute('/company-portal')
    expect(screen.getByText('Company Portal Page')).toBeInTheDocument()
})

test('renders AdminPage on /Admin', () => {
    renderWithRoute('/Admin')
    expect(screen.getByText('Admin Page')).toBeInTheDocument()
})