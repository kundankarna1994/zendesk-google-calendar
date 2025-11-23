import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/app/App'
import { ClientProvider } from '../src/app/contexts/ClientProvider'

const mockClient = {
  on: vi.fn((event, callback) => {
    if (event === 'app.registered') {
      setTimeout(callback, 0)
    }
  }),
  get: vi.fn().mockResolvedValue({ currentUser: { locale: 'en' } }),
  context: vi.fn().mockResolvedValue({ location: 'ticket_sidebar' }),
  invoke: vi.fn(),
}

describe('App Components', () => {
  beforeEach(() => {
    cleanup()
    vi.clearAllMocks()
    document.body.innerHTML = '<div id="root"></div>'
    vi.stubGlobal('ZAFClient', {
      init: vi.fn().mockReturnValue(mockClient),
    })
  })

  it('renders TicketSideBar and shows the correct content', async () => {
    render(
      <ClientProvider>
        <App />
      </ClientProvider>
    )

    expect(mockClient.on).toHaveBeenCalledWith('app.registered', expect.any(Function))

    await waitFor(() => expect(screen.getByText('Hello from Ticket Side Bar')).toBeDefined())
  })

  it('renders Modal and shows the correct content', async () => {
    mockClient.context.mockImplementation(() => Promise.resolve({ location: 'modal' }))
    render(
      <ClientProvider>
        <App />
      </ClientProvider>
    )

    expect(mockClient.on).toHaveBeenCalledWith('app.registered', expect.any(Function))

    await waitFor(() => expect(screen.getByText('Hello from Modal')).toBeDefined())
  })
})
