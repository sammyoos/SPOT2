import { afterEach, describe, expect, it, vi } from 'vitest'
import { loadRecipeDataset } from './recipe-data-loader'

const validPayload = {
  schemaVersion: 1,
  ingredients: [['Blue Mountain Flower', 0]],
  effects: [['Restore Health', 0]],
  recipes: [[[0, 0], [0], 0]],
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadRecipeDataset', () => {
  it('loads a dataset with valid record references', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(validPayload), { status: 200 }),
      ),
    )

    await expect(loadRecipeDataset()).resolves.toEqual(validPayload)
  })

  it('reports an invalid dataset and HTTP failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ schemaVersion: 2 }), { status: 200 }),
      ),
    )
    await expect(loadRecipeDataset()).rejects.toThrow(
      'Recipe data has an unsupported or invalid format',
    )

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 503 })),
    )
    await expect(loadRecipeDataset()).rejects.toThrow(
      'Recipe data request failed (503)',
    )
  })
})
