import { afterAll, afterEach, beforeAll } from 'vitest'
import './test/localStoragePolyfill'
import { setupServer } from 'msw/node'

export const mswServer = setupServer()

beforeAll(() => mswServer.listen({ onUnhandledRequest: 'error' }))
afterEach(() => mswServer.resetHandlers())
afterAll(() => mswServer.close())
