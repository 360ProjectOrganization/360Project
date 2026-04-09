import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import ChooseUserTypeFlow from '../ChooseUserTypeFlow.jsx'

function setup(overrides = {}) {
    const onBack = jest.fn()
    const renderNext = jest.fn((type) => <div data-testid="next-screen">{type}</div>)
    render(
        <ChooseUserTypeFlow
            titleText="Test Title"
            onBack={onBack}
            renderNext={renderNext}
            bottomButton={<span>Bottom</span>}
            footer={(selectAdmin) => (
                <button type="button" onClick={selectAdmin}>
                    Admin entry
                </button>
            )}
            {...overrides}
        />
    )
    return {onBack, renderNext}
}

test('shows title, figures, and bottom; back calls onBack', () => {
    const { onBack } = setup();
    expect(screen.getByRole('heading', { name: 'Test Title' })).toBeInTheDocument()
    expect(screen.getByText('Bottom')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('img', { name: /back button/i }))
    expect(onBack).toHaveBeenCalled()
})

test('Applicant advances to next screen with type Applicant', () => {
    const { renderNext } = setup()
    const applicantFigure = screen.getByText('Applicant').closest('figure')
    fireEvent.click(within(applicantFigure).getByRole('img'))
    expect(screen.getByTestId('next-screen')).toHaveTextContent('Applicant')
    expect(renderNext).toHaveBeenCalled()
})

test('Employer advances to next screen with type Employer', () => {
    setup()
    const employerFigure = screen.getByText('Employer').closest('figure')
    fireEvent.click(within(employerFigure).getByRole('img'))
    expect(screen.getByTestId('next-screen')).toHaveTextContent('Employer')
})

test('footer admin control advances with type Admin', () => {
    setup()
    fireEvent.click(screen.getByRole('button', { name: 'Admin entry' }))
    expect(screen.getByTestId('next-screen')).toHaveTextContent('Admin')
})