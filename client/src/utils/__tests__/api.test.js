import apiRequest, {
    getToken,
    setToken,
    clearToken,
    setAuthUser,
    getAuthUser,
} from '../api.js'

describe('api storage helpers', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    test('token set/get/clear', () => {
        expect(getToken()).toBe(null)
        setToken('t')
        expect(getToken()).toBe('t')
        clearToken()
        expect(getToken()).toBe(null)
    })

    test('auth user set/get and invalid json returns null', () => {
        expect(getAuthUser()).toBe(null)
        setAuthUser({ _id: 'u1', name: 'Test' })
        expect(getAuthUser()).toEqual({ _id: 'u1', name: 'Test' })
        localStorage.setItem('jobly_user', '{bad json')
        expect(getAuthUser()).toBe(null)
    })
})

describe('apiRequest', () => {
    beforeEach(() => {
        localStorage.clear()
        global.fetch = jest.fn()
    })

    test('adds Authorization header when token present and json body stringifies', async () => {
        setToken('tok')
        fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ ok: true }),
        })

        await apiRequest('/x', { method: 'POST', body: { a: 1 } })

        const [, config] = fetch.mock.calls[0]
        expect(config.headers.Authorization).toBe('Bearer tok')
        expect(config.headers['Content-Type']).toBe('application/json')
        expect(config.body).toBe(JSON.stringify({ a: 1 }))
    })

    test('handles non-json response properly', async () => {
        fetch.mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => {
                throw new Error('no json')
            },
        })

        const out = await apiRequest('/x')
        expect(out).toEqual({})
    })

    test('clears token on 401 when it exists', async () => {
        setToken('tok')
        fetch.mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({ error: 'bad' }),
        })

        await expect(apiRequest('/x')).rejects.toThrow('bad')
        expect(getToken()).toBe(null)
    })
})
