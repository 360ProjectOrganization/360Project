import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AdminDropDown from '../AdminDropDown.jsx'

function setup() {
    const setPage = jest.fn()
    const setWhichAnalyticsData = jest.fn()
    const setFilterType = jest.fn()

    render(
        <AdminDropDown setPage={setPage} setWhichAnalyticsData={setWhichAnalyticsData} setFilterType={setFilterType} />
    )
    return {setPage, setWhichAnalyticsData, setFilterType}
}

test('FIns Users sets page and filter type', () => {
    const { setPage, setWhichAnalyticsData, setFilterType } = setup()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Find Users' } })
    expect(setPage).toHaveBeenCalledWith('Find Users')
    expect(setWhichAnalyticsData).not.toHaveBeenCalled()
    expect(setFilterType).toHaveBeenCalledWith('name')
})

test('New Admin only sets page', () => {
    const { setPage, setFilterType } = setup()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'New Admin' } })
    expect(setPage).toHaveBeenCalledWith('New Admin')
    expect(setFilterType).not.toHaveBeenCalled()
})

test('Analytics sets page and default analytics page', () => {
    const { setPage, setWhichAnalyticsData } = setup()
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Analytics' } })
    expect(setPage).toHaveBeenCalledWith('Analytics')
    expect(setWhichAnalyticsData).toHaveBeenCalledWith('jobPostings')
})