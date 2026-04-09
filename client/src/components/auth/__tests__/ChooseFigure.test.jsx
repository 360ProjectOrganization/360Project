import React from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import ChooseFigure from '../ChooseFigure.jsx'

test('shows caption and calls function on image click', () => {
    const fn = jest.fn()
    render(<ChooseFigure text="Applicant" img="mock-applicant.png" func={fn} />)

    const figure = screen.getByText('Applicant').closest('figure')
    fireEvent.click(within(figure).getByRole('img'))
    expect(fn).toHaveBeenCalledTimes(1)
})