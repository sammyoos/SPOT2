import type {
  RecipeDataset,
  RecipeRecord,
} from './recipe-data'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isIngredientRecord(value: unknown): boolean {
  return (
    Array.isArray(value)
    && value.length === 2
    && typeof value[0] === 'string'
    && Number.isInteger(value[1])
    && value[1] >= 0
    && value[1] <= 3
  )
}

function isEffectRecord(value: unknown): boolean {
  return (
    Array.isArray(value)
    && value.length === 2
    && typeof value[0] === 'string'
    && (value[1] === 0 || value[1] === 1)
  )
}

function isIndexList(value: unknown, limit: number): value is number[] {
  return (
    Array.isArray(value)
    && value.every((id) => Number.isInteger(id) && id >= 0 && id < limit)
  )
}

function isRecipeRecord(
  value: unknown,
  ingredientCount: number,
  effectCount: number,
): value is RecipeRecord {
  return (
    Array.isArray(value)
    && value.length === 3
    && isIndexList(value[0], ingredientCount)
    && (value[0].length === 2 || value[0].length === 3)
    && isIndexList(value[1], effectCount)
    && value[1].length >= 1
    && value[1].length <= 5
    && (value[2] === 0 || value[2] === 1 || value[2] === 2)
  )
}

function isRecipeDataset(value: unknown): value is RecipeDataset {
  if (!isRecord(value) || value.schemaVersion !== 1) return false

  const ingredients = value.ingredients
  const effects = value.effects
  const recipes = value.recipes

  return (
    Array.isArray(ingredients)
    && ingredients.every(isIngredientRecord)
    && Array.isArray(effects)
    && effects.every(isEffectRecord)
    && Array.isArray(recipes)
    && recipes.every((recipe) =>
      isRecipeRecord(recipe, ingredients.length, effects.length),
    )
  )
}

export async function loadRecipeDataset(
  signal?: AbortSignal,
): Promise<RecipeDataset> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/recipes.json`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Recipe data request failed (${response.status})`)
  }

  const payload: unknown = await response.json()
  if (!isRecipeDataset(payload)) {
    throw new Error('Recipe data has an unsupported or invalid format')
  }

  return payload
}
