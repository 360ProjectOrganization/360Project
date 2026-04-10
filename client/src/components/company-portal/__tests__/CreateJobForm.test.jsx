import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreateJobForm from '../CreateJobForm.jsx'
import { jobPostingApi } from '../../../utils/api.js'

jest.mock('../../../utils/api.js', () => ({
    jobPostingApi: { createJobPosting: jest.fn() },
}))

jest.mock('../JobPostingForm.jsx', () => ({
    __esModule: true,
    default: ({ submitLabel, onSubmit }) => (
        <div>
            <button onClick={() => onSubmit({ title: 'T', location: 'L', description: 'D' })}>
                {submitLabel}
            </button>
        </div>
    ),
}))

test('creates job posting and calls onSuccess', async () => {
    jobPostingApi.createJobPosting.mockResolvedValue({ ok: true })
    const onSuccess = jest.fn()

    render(<CreateJobForm companyId="c1" onSuccess={onSuccess} onCancel={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
        expect(jobPostingApi.createJobPosting).toHaveBeenCalledWith('c1', {
            title: 'T',
            location: 'L',
            description: 'D',
        })
        expect(onSuccess).toHaveBeenCalled()
    })
})