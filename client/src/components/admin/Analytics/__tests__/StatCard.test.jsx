import React from 'react'
import { render, screen } from '@testing-library/react'
import StatCard from '../StatCard.jsx'

test('renders label and value', () => {
    render(<StatCard label="Total Users" value={42} />)
    expect(screen.getByText('Total Users')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
})