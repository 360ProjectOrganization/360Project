import React from 'react'
import { render, screen } from '@testing-library/react' //render shows components in fake DOM and screen lets us query what's on the page
import { MemoryRouter } from 'react-router-dom' // fake router
import App from '../App'

// Mock each page component (basically replaces the real pages with fake ones so we can test routing)
jest.mock('../pages/HomePage', () => () => <div>Home Page</div>)
jest.mock('../pages/RegisterPage', () => () => <div>Register Page</div>)
jest.mock('../pages/LoginPage', () => () => <div>Login Page</div>)
jest.mock('../pages/ProfilePage', () => () => <div>Profile Page</div>)
jest.mock('../pages/CompanyPortalPage', () => () => <div>Company Portal Page</div>)
jest.mock('../pages/AdminPage', () => () => <div>Admin Page</div>)
jest.mock('../pages/NotFound', () => () => <div>Not Found Page</div>)

const TOKEN_KEY = 'jobly_token'

const FAKE_ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW5pc3RyYXRvciJ9.fake-signature'
const FAKE_COMPANY_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiY29tcGFueSJ9.fake-signature'

afterEach(() => {
    localStorage.clear()
})

// sets the url to whatever is passed in and renders the app, reusable for tests
function renderWithRoute(route) {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <App />
        </MemoryRouter>
    )
}

test('redirects to login if token is invalid', () => {
    localStorage.setItem(TOKEN_KEY, 'notatoken')
    renderWithRoute('/profile')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
})

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
    localStorage.setItem(TOKEN_KEY, FAKE_COMPANY_TOKEN)
    renderWithRoute('/profile')
    expect(screen.getByText('Profile Page')).toBeInTheDocument()
})

test('block user from opening profile page if they are not authenticated', () => {
    renderWithRoute('/profile')
    expect(screen.queryByText('Profile Page')).not.toBeInTheDocument()
})

test('renders CompanyPortalPage on /company-portal', () => {
    localStorage.setItem(TOKEN_KEY, FAKE_COMPANY_TOKEN)
    renderWithRoute('/company-portal')
    expect(screen.getByText('Company Portal Page')).toBeInTheDocument()
})

test('blocks users from company portal if they are not companies', () => {
    localStorage.setItem(TOKEN_KEY, FAKE_ADMIN_TOKEN)
    renderWithRoute('/company-portal')
    expect(screen.getByText('Home Page')).toBeInTheDocument()
})

test('blocks user from opening company portal page if they are not authenticated', () => {
    renderWithRoute('/company-portal')
    expect(screen.getByText('Login Page')).toBeInTheDocument()
})

test('renders AdminPage on /Admin', () => {
    localStorage.setItem(TOKEN_KEY, FAKE_ADMIN_TOKEN)
    renderWithRoute('/Admin')
    expect(screen.getByText('Admin Page')).toBeInTheDocument()
})

test('blocks users from admin page if they are not admins', () => {
    localStorage.setItem(TOKEN_KEY, FAKE_COMPANY_TOKEN)
    renderWithRoute('/Admin')
    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument()
})

test('block user from opening admin page if they are not authenticated', () => {
    renderWithRoute('/Admin')
    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument()
})

test('opens 404 not found page if user goes to bad navigation', () => {
    renderWithRoute('/bad')
    expect(screen.queryByText('Not Found Page')).toBeInTheDocument()
})