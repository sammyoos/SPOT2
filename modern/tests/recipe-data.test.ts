import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import type { RecipeDataset } from '../src/data/recipe-data'

const dataset = JSON.parse(
  readFileSync(new URL('../public/data/recipes.json', import.meta.url), 'utf8'),
) as RecipeDataset

function findRecipe(ingredientNames: string[]) {
  const expectedNames = [...ingredientNames].sort()

  return dataset.recipes.find(([ingredientIds]) => {
    const names = ingredientIds
      .map((id) => dataset.ingredients[id][0])
      .sort()

    return names.length === expectedNames.length
      && names.every((name, index) => name === expectedNames[index])
  })
}

describe('prepared legacy recipe data', () => {
  it('preserves the agreed ingredient, effect, and recipe counts', () => {
    expect(dataset.schemaVersion).toBe(1)
    expect(dataset.ingredients).toHaveLength(113)
    expect(
      [...new Set(dataset.ingredients.map(([, contentPackId]) => contentPackId))].sort(),
    ).toEqual([0, 1, 2, 3])
    expect(dataset.effects).toHaveLength(55)
    expect(dataset.recipes).toHaveLength(36_731)
    expect(dataset.recipes.filter(([ingredients]) => ingredients.length === 2)).toHaveLength(1_814)
    expect(dataset.recipes.filter(([ingredients]) => ingredients.length === 3)).toHaveLength(34_917)
    expect(dataset.recipes.filter(([, effects]) => effects.length === 5)).toHaveLength(12)
  })

  it('preserves the agreed two- and three-ingredient examples', () => {
    const twoIngredientRecipe = findRecipe(['Blue Mountain Flower', 'Wheat'])
    const threeIngredientRecipe = findRecipe([
      'Bear Claws',
      'Charred Skeever Hide',
      'Wheat',
    ])

    expect(twoIngredientRecipe).toBeDefined()
    expect(threeIngredientRecipe).toBeDefined()
    if (!twoIngredientRecipe || !threeIngredientRecipe) return

    expect(twoIngredientRecipe[1].map((id) => dataset.effects[id][0])).toEqual([
      'Fortify Health',
      'Restore Health',
    ])
    expect(threeIngredientRecipe[1].map((id) => dataset.effects[id][0])).toEqual([
      'Fortify Health',
      'Restore Health',
      'Restore Stamina',
    ])
  })
})
