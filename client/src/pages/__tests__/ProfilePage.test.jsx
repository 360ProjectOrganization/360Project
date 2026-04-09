import React from 'react'
import { render, screen } from '@testing-library/react'
import ProfilePage from "../ProfilePage.jsx"

jest.mock('../../components/header/Header.jsx', () => () => <div>Mock Header</div>)
jest.mock('../../components/profile-page/Profile.jsx', () => () => (<div>Mock Profile</div>))

test('renders header and profile page', () => {
    render(<ProfilePage />)
    expect(screen.getByText('Mock Header')).toBeInTheDocument()
    expect(screen.getByText('Mock Profile')).toBeInTheDocument()
})