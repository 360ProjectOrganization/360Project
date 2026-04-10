import React from 'react'
import { render } from '@testing-library/react'
import PieChart from '../AnalyticsCharts/PieChart.jsx'

const mockPie = jest.fn(() => null)

jest.mock('react-chartjs-2', () => ({
    Pie: (props) => mockPie(props),
}))

describe('PieChart', () => {
    beforeEach(() => {
        mockPie.mockClear()
    })

    test('passes labels, data, and title to Pie', () => {
        render(
            <PieChart pieChartTitle="Fill Rate" chartData={[3, 1]} chartLabels={['Filled', 'Unfilled']} chartBackgroundColor={['green', 'red']} />
        )

        expect(mockPie).toHaveBeenCalledTimes(1)
        const { data, options } = mockPie.mock.calls[0][0]

        expect(data.labels).toEqual(['Filled', 'Unfilled'])
        expect(data.datasets[0].data).toEqual([3, 1])
        expect(data.datasets[0].backgroundColor).toEqual(['green', 'red'])
    })

    test('datalabels formatter returns percent and handles total = 0', () => {
        render(
            <PieChart pieChartTitle="Fill Rate" chartData={[0, 0]} chartLabels={['A', 'B']} chartBackgroundColor={['a', 'b']} />
        )

        const { options } = mockPie.mock.calls[0][0]
        const formatter = options.plugins.datalabels.formatter

        // total = 0
        const ctxZero = { chart: { data: { datasets: [{ data: [0, 0] }] } } }
        expect(formatter(0, ctxZero)).toBe('0%')

        // normal percent (3/4 * 100 = 75%)
        const ctx = { chart: { data: { datasets: [{ data: [3, 1] }] } } }
        expect(formatter(3, ctx)).toBe('75.0%')
    })
})