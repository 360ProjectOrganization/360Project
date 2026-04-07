import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Breadcrumbs from '../Breadcrumbs.jsx'

function renderBreadcrumbsAt(path) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Breadcrumbs />
        </MemoryRouter>
    )
}

describe('Breadcrumbs', () => {
    test('hides on paths not in the list of showBreadcrumbs', () => {
        renderBreadcrumbsAt('/register')
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
        expect(screen.queryByText('Home')).not.toBeInTheDocument()
    })

    test('hides on home route /', () => {
        renderBreadcrumbsAt('/')
        expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
        expect(screen.queryByText('Home')).not.toBeInTheDocument()
    })

    test('shows breadcrumbs on profile', () => {
        renderBreadcrumbsAt('/profile')
        const nav = screen.getByRole('navigation')
        expect(nav).toBeInTheDocument()
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Profile')).toBeInTheDocument()
        expect(within(nav).getAllByRole('link')).toHaveLength(1)
        expect(nav.textContent).toMatch(/Home\s*\/\s*Profile/)
    })

    test('show breadcrumbs on company-portal', () => {
        renderBreadcrumbsAt('/company-portal')
        const nav = screen.getByRole('navigation')
        expect(nav).toBeInTheDocument()
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Company Portal')).toBeInTheDocument()
        expect(within(nav).getAllByRole('link')).toHaveLength(1)
        expect(nav.textContent).toMatch(/Home\s*\/\s*Company Portal/)
    })

    test('show breadcrumbs on Admin', () => {
        renderBreadcrumbsAt('/Admin')
        const nav = screen.getByRole('navigation')
        expect(nav).toBeInTheDocument()
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Admin')).toBeInTheDocument()
        expect(within(nav).getAllByRole('link')).toHaveLength(1)
        expect(nav.textContent).toMatch(/Home\s*\/\s*Admin/)
    })

    test('Home crumb links to / on profile', () => {
        renderBreadcrumbsAt('/profile')
        const homeLink = screen.getByRole('link', { name: 'Home' })
        expect(homeLink).toHaveAttribute('href', '/')
    })

    test('Home crumb links to / on company-portal', () => {
        renderBreadcrumbsAt('/company-portal')
        const homeLink = screen.getByRole('link', { name: 'Home' })
        expect(homeLink).toHaveAttribute('href', '/')
    })

    test('Home crumb links to / on Admin', () => {
        renderBreadcrumbsAt('/Admin')
        const homeLink = screen.getByRole('link', { name: 'Home' })
        expect(homeLink).toHaveAttribute('href', '/')
    })

    test('Profile is last crumb and does not contain a link', () => {
        renderBreadcrumbsAt('/profile')
        const profileCrumb = screen.getByText('Profile')
        expect(profileCrumb).toBeInTheDocument()
        expect(profileCrumb).not.toHaveAttribute('href')
    })

    test('Company Portal is last crumb and does not contain a link', () => {
        renderBreadcrumbsAt('/company-portal')
        const companyPortalCrumb = screen.getByText('Company Portal')
        expect(companyPortalCrumb).toBeInTheDocument()
        expect(companyPortalCrumb).not.toHaveAttribute('href')
    })

    test('Admin is last crumb and does not contain a link', () => {
        renderBreadcrumbsAt('/Admin')
        const adminCrumb = screen.getByText('Admin')
        expect(adminCrumb).toHaveTextContent('Admin')
        expect(adminCrumb).not.toHaveAttribute('href')
    })
})