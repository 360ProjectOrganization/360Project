import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CloseStatus from '../CloseStatus.jsx'

jest.mock('../../common/Modal.jsx', () => ({
    __esModule: true,
    default: ({ isOpen, children, title }) => (isOpen ? <div><div>{title}</div>{children}</div> : null),
}))

test('Close Posting disabled until reason selected, then calls onClosePosting', async () => {
    const onClosePosting = jest.fn().mockResolvedValue({})
    const onClose = jest.fn()

    render(
        <CloseStatus postingToClose={{ _id: 'p1', title: 'Role' }} onClose={onClose} onClosePosting={onClosePosting} />
    )

    const closeBtn = screen.getByRole('button', { name: /close posting/i })
    expect(closeBtn).toBeDisabled()

    fireEvent.click(screen.getByLabelText(/position was filled/i))
    expect(closeBtn).not.toBeDisabled()

    fireEvent.click(closeBtn)
    expect(onClosePosting).toHaveBeenCalledWith('p1', 'FILLED')
})