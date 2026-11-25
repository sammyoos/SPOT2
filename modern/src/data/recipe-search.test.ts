import { describe, expect, it } from 'vitest'
import type { RecipeDataset } from './recipe-data'
import {
  getRecipePage,
  RECIPE_PAGE_SIZE,
  searchRecipes,
} from './recipe-search'

const dataset: RecipeDataset = {
  schemaVersion: 1,
  ingredients: [
    ['Abecean Longfin', 0],
    ['Blue Mountain Flower', 0],
    ['Charred Skeever Hide', 1],
    ['Wheat', 2],
  ],
  effects: [
    ['Fortify Health', 0],
    ['Restore Health', 0],
    ['Damage Health', 1],
  ],
  recipes: [
    [[0, 1], [0, 1], 0],
    [[1, 2], [0], 0],
    [[2, 3], [1, 2], 2],
    [[0, 1, 2], [0, 1, 2], 2],
  ],
}

const allPacks = new Set([0, 1, 2, 3] as const)
const defaultOptions = {
  enabledContentPacks: allPacks,
  selectedIngredientIds: new Set<number>(),
  selectedEffectIds: new Set<number>(),
  ingredientCount: 'any' as const,
  effectCount: 'any' as const,
  nature: 'any' as const,
}

describe('searchRecipes', () => {
  it('narrows available items after an ingredient or effect is required', () => {
    const byIngredient = searchRecipes(dataset, {
      ...defaultOptions,
      selectedIngredientIds: new Set([3]),
    })
    const byEffect = searchRecipes(dataset, {
      ...defaultOptions,
      selectedEffectIds: new Set([2]),
    })

    expect(byIngredient.recipeIds).toEqual([2])
    expect([...byIngredient.availableIngredientIds]).toEqual([2, 3])
    expect([...byIngredient.availableEffectIds]).toEqual([1, 2])
    expect(byEffect.recipeIds).toEqual([2, 3])
    expect([...byEffect.availableIngredientIds].sort()).toEqual([0, 1, 2, 3])
    expect([...byEffect.availableEffectIds].sort()).toEqual([0, 1, 2])
  })

  it('combines content pack and independent recipe filters', () => {
    const results = searchRecipes(dataset, {
      ...defaultOptions,
      enabledContentPacks: new Set([0] as const),
      selectedIngredientIds: new Set([1]),
      selectedEffectIds: new Set([0]),
      ingredientCount: 2,
      effectCount: 2,
      nature: 'positive',
    })

    expect(results.recipeIds).toEqual([0])
    expect([...results.availableIngredientIds]).toEqual([0, 1])
  })

  it('returns no available items when filters leave no matching recipes', () => {
    const results = searchRecipes(dataset, {
      ...defaultOptions,
      selectedIngredientIds: new Set([3]),
      nature: 'positive',
    })

    expect(results.recipeIds).toEqual([])
    expect(results.availableIngredientIds.size).toBe(0)
    expect(results.availableEffectIds.size).toBe(0)
  })
})

describe('recipe result pages', () => {
  it('keeps pages at 50 results and covers the final partial page', () => {
    const recipeIds = Array.from({ length: 127 }, (_, id) => id)

    expect(RECIPE_PAGE_SIZE).toBe(50)
    expect(getRecipePage(recipeIds, 1)).toEqual(recipeIds.slice(0, 50))
    expect(getRecipePage(recipeIds, 2)).toEqual(recipeIds.slice(50, 100))
    expect(getRecipePage(recipeIds, 3)).toEqual(recipeIds.slice(100, 127))
  })
})
