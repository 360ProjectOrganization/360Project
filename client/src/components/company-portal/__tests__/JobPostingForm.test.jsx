import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import JobPostingForm from '../JobPostingForm.jsx'
import { validateCreateJobForm } from '../../../utils/validation/validateCreateJobForm.js'

jest.mock('../../../utils/validation/validateCreateJobForm.js', () => ({
    validateCreateJobForm: jest.fn(),
}))

describe('JobPostingForm', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('blocks submit on validation errors', async () => {
        validateCreateJobForm.mockReturnValue({ title: 'Title required' })
        const onSubmit = jest.fn()

        render(<JobPostingForm onSubmit={onSubmit} onCancel={jest.fn()} />)
        fireEvent.click(screen.getByRole('button', { name: 'Save' }))

        expect(onSubmit).not.toHaveBeenCalled()
        expect(screen.getByText('Title required')).toBeInTheDocument()
    })

    test('submits with tags parsed when showTagsField is true', async () => {
        validateCreateJobForm.mockReturnValue({})
        const onSubmit = jest.fn().mockResolvedValue({})
        render(<JobPostingForm onSubmit={onSubmit} showTagsField={true} />)

        fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'coding' } })
        fireEvent.change(screen.getByPlaceholderText('Location'), { target: { value: 'Remote' } })
        fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'Desc' } })
        fireEvent.change(screen.getByPlaceholderText(/react, javascript/i), { target: { value: ' React,  ,Remote  ' } })

        fireEvent.click(screen.getByRole('button', { name: 'Save' }))

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalledWith({
                title: 'coding',
                location: 'Remote',
                description: 'Desc',
                tags: ['React', 'Remote'],
            })
        })
    })

    test('cancel calls onCancel', () => {
        const onCancel = jest.fn()
        render(<JobPostingForm onCancel={onCancel} />)
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
        expect(onCancel).toHaveBeenCalled()
    })
})