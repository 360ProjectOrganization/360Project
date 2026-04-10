import React from 'react'
import { render, screen } from '@testing-library/react'
import Card from '../Card.jsx'

describe('Card', () => {
    test('renders title, children, and footer', () => {
        render(
            <Card title="My Title" footer={<div>Footer</div>}>
                <div>Body</div>
            </Card>
        )

        expect(screen.getByText('My Title')).toBeInTheDocument()
        expect(screen.getByText('Body')).toBeInTheDocument()
        expect(screen.getByText('Footer')).toBeInTheDocument()
    })

    test('does not render title or footer when not provided', () => {
        render(
            <Card>
                <div>Body</div>
            </Card>
        )

        expect(screen.getByText('Body')).toBeInTheDocument()
        expect(screen.queryByRole('heading')).not.toBeInTheDocument()
    })
})