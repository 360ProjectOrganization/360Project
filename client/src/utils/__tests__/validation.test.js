import { validateCreateJobForm } from '../validation/validateCreateJobForm.js'
import { validateEmailChange } from '../validation/validateEmailChange.js'
import { validatePasswordChange } from '../validation/validatePasswordChange.js'
import { validateRegisterForm } from '../validation/validateRegisterForm.js'

describe('validateCreateJobForm', () => {
    test('requires all fields', () => {
        expect(validateCreateJobForm({ title: '', location: '', description: '' })).toEqual({
            title: 'Title is required',
            location: 'Location is required',
            description: 'Description is required',
        })
    })

    test('returns empty object when valid', () => {
        expect(validateCreateJobForm({ title: 'T', location: 'L', description: 'D' })).toEqual({})
    })
})

describe('validateEmailChange', () => {
    test('requires email', () => {
        expect(validateEmailChange({ email: '' })).toEqual({ email: 'Email is required' })
    })

    test('validates email format', () => {
        expect(validateEmailChange({ email: 'bad' })).toEqual({ email: 'Invalid email' })
        expect(validateEmailChange({ email: 'a@b.com' })).toEqual({})
    })
})

describe('validatePasswordChange', () => {
    test('requires password and confirm', () => {
        const e = validatePasswordChange({ password: '', confirmPassword: '' })
        expect(e.password).toBe('Password is required')
        expect(e.confirmPassword).toBe('Please confirm your password')
    })

    test('requires matching confirm', () => {
        const e = validatePasswordChange({ password: 'Abcd1234', confirmPassword: 'Abcd12345' })
        expect(e.confirmPassword).toBe('Passwords do not match')
    })

    test('accepts a strong password', () => {
        expect(validatePasswordChange({ password: 'Abcd1234', confirmPassword: 'Abcd1234' })).toEqual({})
    })
})

describe('validateRegisterForm', () => {
    test('applicant requires first and last name', () => {
        const e = validateRegisterForm(
            { name: 'Jane', email: 'a@b.com', password: 'Abcd1234', confirmPassword: 'Abcd1234' },
            'applicant'
        )
        expect(e.name).toBe('Enter first and last name')
    })

    test('employer requires company name (non-empty)', () => {
        const e = validateRegisterForm(
            { name: '', email: 'a@b.com', password: 'Abcd1234', confirmPassword: 'Abcd1234' },
            'employer'
        )
        expect(e.name).toBe('Company name is required')
    })

    test('valid applicant returns empty errors', () => {
        const e = validateRegisterForm(
            { name: 'Jane Doe', email: 'a@b.com', password: 'Abcd1234', confirmPassword: 'Abcd1234' },
            'applicant'
        )
        expect(e).toEqual({})
    })
})

