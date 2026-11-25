import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the initial shell and loading state', () => {
    const markup = renderToStaticMarkup(<App />)

    expect(markup).toContain('Skyrim Potion Optimizer')
    expect(markup).toContain('Preparing the alchemy table')
    expect(markup).toContain('Loading the ingredient and recipe index')
  })
})
