import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditJobForm from '../EditJobForm.jsx'
import { jobPostingApi } from '../../../utils/api.js'

jest.mock('../../../utils/api.js', () => ({
    jobPostingApi: { update: jest.fn() },
}))

jest.mock('../JobPostingForm.jsx', () => ({
    __esModule: true,
    default: ({ onSubmit }) => (
        <button onClick={() => onSubmit({ title: 'T', location: 'L', description: 'D', status: 'ACTIVE', tags: [] })}>
            Update
        </button>
    ),
}))

test('updates job posting and calls onSuccess with payload', async () => {
    jobPostingApi.update.mockResolvedValue({ ok: true })
    const onSuccess = jest.fn()

    render(
        <EditJobForm posting={{ _id: 'p1', title: 'Old', status: 'ACTIVE' }} onClosePosting={jest.fn()} onSuccess={onSuccess} onCancel={jest.fn()} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Update' }))

    const payload = { title: 'T', location: 'L', description: 'D', status: 'ACTIVE', tags: [] }

    await waitFor(() => {
        expect(jobPostingApi.update).toHaveBeenCalledWith('p1', expect.objectContaining(payload))
        expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining(payload))
    })
})